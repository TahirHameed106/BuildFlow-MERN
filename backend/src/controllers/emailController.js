const nodemailer = require("nodemailer");
const EmailLog = require("../models/EmailLog");

exports.sendEmail = async (req, res) => {
  try {
    const { to, subject, body } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: body
    });

    await EmailLog.create({ to, subject, body });

    res.json({ success: true, message: "Email sent!" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
};
