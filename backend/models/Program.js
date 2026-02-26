const mongoose = require('mongoose');

const programSchema = new mongoose.Schema(
  {
    institution: { type: mongoose.Schema.Types.ObjectId, ref: 'Institution', required: true },
    name: { type: String, required: true },
    code: { type: String, required: true },
    academicYear: { type: String, required: true },
    courseType: { type: String, enum: ['UG', 'PG'], required: true },
    entryTypeOptions: [{ type: String, enum: ['Regular', 'Lateral'] }],
    admissionModes: [{ type: String, enum: ['Government', 'Management'] }]
  },
  { timestamps: true }
);

const Program = mongoose.model('Program', programSchema);

module.exports = { Program };

