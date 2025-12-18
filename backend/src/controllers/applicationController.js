const Application = require("../models/Application");

exports.createApplication = async (req, res) => {
  try {
    const { jobId, applicantName } = req.body;
    const newApp = await Application.create({ jobId, applicantName });
    res.status(201).json(newApp);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getApplications = async (req, res) => {
  try {
    const apps = await Application.find();
    res.status(200).json(apps);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};