const mongoose = require('mongoose');

const basicDetailsSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    dateOfBirth: String,
    address: String
  },
  { _id: false }
);

const applicantSchema = new mongoose.Schema(
  {
    basicDetails: { type: basicDetailsSchema, required: true },
    category: { type: String, required: true },
    entryType: { type: String, enum: ['Regular', 'Lateral'], required: true },
    quotaType: { type: String, enum: ['KCET', 'COMEDK', 'MANAGEMENT'], required: true },
    admissionMode: { type: String, enum: ['Government', 'Management'], required: true },
    marks: { type: Number, required: true },
    allotmentNumber: { type: String },
    program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: true },
    academicYear: { type: String, required: true },
    documentsStatus: {
      type: String,
      enum: ['Pending', 'Submitted', 'Verified'],
      default: 'Pending'
    },
    feeStatus: {
      type: String,
      enum: ['Pending', 'Paid'],
      default: 'Pending'
    },
    admissionStatus: {
      type: String,
      enum: ['Seat Locked', 'Confirmed'],
      default: 'Seat Locked'
    },
    admissionNumber: { type: String, unique: true, sparse: true }
  },
  { timestamps: true }
);

const Applicant = mongoose.model('Applicant', applicantSchema);

module.exports = { Applicant };

