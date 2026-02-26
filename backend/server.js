const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const { Institution } = require('./models/Institution');
const { Program } = require('./models/Program');
const { SeatMatrix } = require('./models/SeatMatrix');
const { Applicant } = require('./models/Applicant');

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/admission_management';

app.use(cors());
app.use(express.json());

// Serve frontend
const publicDir = path.join(__dirname, '..', 'public');
app.use(express.static(publicDir));

// ---------- MASTER SETUP ----------

app.post('/api/institutions', async (req, res) => {
  try {
    const inst = await Institution.create(req.body);
    res.status(201).json(inst);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create institution', error: err.message });
  }
});

app.get('/api/institutions', async (req, res) => {
  const list = await Institution.find().sort({ name: 1 });
  res.json(list);
});

app.post('/api/programs', async (req, res) => {
  try {
    const program = await Program.create(req.body);
    res.status(201).json(program);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create program', error: err.message });
  }
});

app.get('/api/programs', async (req, res) => {
  const list = await Program.find().populate('institution').sort({ name: 1 });
  res.json(list);
});

app.post('/api/seat-matrices', async (req, res) => {
  try {
    const { program, academicYear, totalIntake, quotas } = req.body;

    const baseTotal =
      (quotas?.KCET?.base || 0) +
      (quotas?.COMEDK?.base || 0) +
      (quotas?.MANAGEMENT?.base || 0);

    if (baseTotal !== totalIntake) {
      return res.status(400).json({
        message: 'Total base quota must equal intake'
      });
    }

    const seatMatrix = await SeatMatrix.create({
      program,
      academicYear,
      totalIntake,
      quotas
    });
    res.status(201).json(seatMatrix);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create seat matrix', error: err.message });
  }
});

app.get('/api/seat-matrices', async (req, res) => {
  const list = await SeatMatrix.find().populate('program').sort({ academicYear: -1 });
  res.json(list);
});

// ---------- APPLICANT & ALLOCATION ----------

app.post('/api/applicants/create-and-allocate', async (req, res) => {
  try {
    const {
      basicDetails,
      category,
      entryType,
      quotaType,
      marks,
      programId,
      academicYear,
      allotmentNumber,
      admissionMode
    } = req.body;

    const validGovQuota = quotaType === 'KCET' || quotaType === 'COMEDK';
    if (admissionMode === 'Government' && !validGovQuota) {
      return res.status(400).json({ message: 'Government flow supports KCET/COMEDK only' });
    }

    if (admissionMode === 'Management' && quotaType !== 'MANAGEMENT') {
      return res.status(400).json({ message: 'Management flow must use MANAGEMENT quota' });
    }

    const seatMatrix = await SeatMatrix.findOne({ program: programId, academicYear });
    if (!seatMatrix) {
      return res.status(400).json({ message: 'Seat matrix not configured for program/year' });
    }

    const quota = seatMatrix.quotas[quotaType];
    if (!quota) {
      return res.status(400).json({ message: 'Quota not configured for this program' });
    }

    if (quota.filled >= quota.base) {
      return res.status(400).json({ message: 'No seat allocation, quota full' });
    }

    const applicant = await Applicant.create({
      basicDetails,
      category,
      entryType,
      quotaType,
      marks,
      program: programId,
      academicYear,
      allotmentNumber: allotmentNumber || null,
      documentsStatus: 'Pending',
      feeStatus: 'Pending',
      admissionStatus: 'Seat Locked',
      admissionNumber: null,
      admissionMode
    });

    quota.filled += 1;
    await seatMatrix.save();

    res.status(201).json(applicant);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create applicant', error: err.message });
  }
});

app.get('/api/applicants', async (req, res) => {
  const list = await Applicant.find()
    .populate('program')
    .sort({ createdAt: -1 });
  res.json(list);
});

app.patch('/api/applicants/:id/documents', async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['Pending', 'Submitted', 'Verified'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid document status' });
    }
    const applicant = await Applicant.findByIdAndUpdate(
      req.params.id,
      { documentsStatus: status },
      { new: true }
    );
    res.json(applicant);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update documents status', error: err.message });
  }
});

app.patch('/api/applicants/:id/fee', async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['Pending', 'Paid'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid fee status' });
    }
    const applicant = await Applicant.findByIdAndUpdate(
      req.params.id,
      { feeStatus: status },
      { new: true }
    );
    res.json(applicant);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update fee status', error: err.message });
  }
});

// Admission confirmation + admission number generation
app.post('/api/applicants/:id/confirm', async (req, res) => {
  try {
    const applicant = await Applicant.findById(req.params.id).populate('program').populate({
      path: 'program',
      populate: { path: 'institution' }
    });

    if (!applicant) {
      return res.status(404).json({ message: 'Applicant not found' });
    }

    if (applicant.feeStatus !== 'Paid') {
      return res.status(400).json({ message: 'Admission can be confirmed only after fee is paid' });
    }

    if (applicant.admissionNumber) {
      return res.json(applicant);
    }

    const institutionCode = applicant.program.institution.code || 'INST';
    const year = applicant.academicYear || '2026';
    const courseType = applicant.program.courseType || 'UG';
    const programCode = applicant.program.code || 'GEN';
    const quota = applicant.quotaType || 'GEN';

    const prefix = `${institutionCode}/${year}/${courseType}/${programCode}/${quota}/`;

    const existingCount = await Applicant.countDocuments({
      admissionNumber: { $regex: `^${prefix}` }
    });
    const seq = String(existingCount + 1).padStart(4, '0');
    const admissionNumber = `${prefix}${seq}`;

    applicant.admissionNumber = admissionNumber;
    applicant.admissionStatus = 'Confirmed';
    await applicant.save();

    res.json(applicant);
  } catch (err) {
    res.status(400).json({ message: 'Failed to confirm admission', error: err.message });
  }
});

// ---------- DASHBOARD ----------

app.get('/api/dashboard/overview', async (req, res) => {
  try {
    const seatMatrices = await SeatMatrix.find().populate('program');
    const applicants = await Applicant.find().populate('program');

    const totalIntake = seatMatrices.reduce((sum, s) => sum + (s.totalIntake || 0), 0);
    const admitted = applicants.filter(a => a.admissionStatus === 'Confirmed').length;

    const quotaFilled = seatMatrices.reduce(
      (acc, s) => {
        if (s.quotas?.KCET) acc.KCET += s.quotas.KCET.filled;
        if (s.quotas?.COMEDK) acc.COMEDK += s.quotas.COMEDK.filled;
        if (s.quotas?.MANAGEMENT) acc.MANAGEMENT += s.quotas.MANAGEMENT.filled;
        return acc;
      },
      { KCET: 0, COMEDK: 0, MANAGEMENT: 0 }
    );

    const remainingSeats = seatMatrices.map(s => ({
      programName: s.program.name,
      academicYear: s.academicYear,
      quotas: {
        KCET: s.quotas?.KCET
          ? s.quotas.KCET.base - s.quotas.KCET.filled
          : 0,
        COMEDK: s.quotas?.COMEDK
          ? s.quotas.COMEDK.base - s.quotas.COMEDK.filled
          : 0,
        MANAGEMENT: s.quotas?.MANAGEMENT
          ? s.quotas.MANAGEMENT.base - s.quotas.MANAGEMENT.filled
          : 0
      }
    }));

    const pendingDocuments = applicants.filter(a => a.documentsStatus !== 'Verified');
    const feePending = applicants.filter(a => a.feeStatus !== 'Paid');

    res.json({
      totalIntake,
      admitted,
      quotaFilled,
      remainingSeats,
      pendingDocuments,
      feePending
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load dashboard', error: err.message });
  }
});

// Fallback to frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Admission management server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });

