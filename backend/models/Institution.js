const mongoose = require('mongoose');

const institutionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    campus: { type: String, required: true },
    department: { type: String, required: true }
  },
  { timestamps: true }
);

const Institution = mongoose.model('Institution', institutionSchema);

module.exports = { Institution };

