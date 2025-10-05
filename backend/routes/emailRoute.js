const express = require("express");
const router = express.Router();
const sendEmail = require("../utils/sendEmail"); // your updated sendEmail function
const Issue = require("../model/ReportData");
const Violation = require("../model/ViolationData");

router.post("/send-email", async (req, res) => {
  const { reportId, reportType } = req.body;
  try {
    let report;
    if (reportType === "issue") {
      report = await Issue.findById(reportId);
    } else {
      report = await Violation.findById(reportId);
    }

    if (!report) return res.status(404).json({ message: "Report not found" });
    if (!report.userEmail) return res.status(400).json({ message: "No email associated with report" });

    await sendEmail(
      report.userEmail,
      "Your Report Has Been Resolved ✅",
      `Hello, your report titled "${report.title}" has been marked as resolved.`,
      `<p>Hello,</p><p>Your report titled "<b>${report.title}</b>" has been marked as <b>Resolved</b>.</p><p>Thank you for using CivicHero!</p>`
    );

    res.json({ message: "Email sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send email" });
  }
});

module.exports = router;
