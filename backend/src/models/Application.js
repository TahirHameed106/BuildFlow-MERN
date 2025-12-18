const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  jobId: { type: String, required: true },
  applicantName: { type: String, required: true },
  status: { type: String, default: "Applied" },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Application", ApplicationSchema);