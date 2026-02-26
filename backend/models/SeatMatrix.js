const mongoose = require('mongoose');

const quotaSchema = new mongoose.Schema(
  {
    base: { type: Number, required: true },
    filled: { type: Number, default: 0 }
  },
  { _id: false }
);

const seatMatrixSchema = new mongoose.Schema(
  {
    program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: true },
    academicYear: { type: String, required: true },
    totalIntake: { type: Number, required: true },
    quotas: {
      KCET: { type: quotaSchema, required: false },
      COMEDK: { type: quotaSchema, required: false },
      MANAGEMENT: { type: quotaSchema, required: false }
    }
  },
  { timestamps: true }
);

const SeatMatrix = mongoose.model('SeatMatrix', seatMatrixSchema);

module.exports = { SeatMatrix };

