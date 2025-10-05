const nodemailer = require("nodemailer");

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send an email
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} [text] - Plain text content
 * @param {string} [html] - HTML content
 * @param {object} [options] - Optional settings (cc, bcc, retries)
 */
const sendEmail = async (to, subject, text = "", html = "", options = {}) => {
  const { cc, bcc, retries = 2 } = options;

  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      await transporter.sendMail({
        from: `"CivicHero Notifications" <${process.env.EMAIL_USER}>`,
        to,
        cc,
        bcc,
        subject,
        text: text || html.replace(/<[^>]+>/g, ""), // fallback to plain text if text not provided
        html: html || undefined,
      });

      console.log(`✅ [${new Date().toISOString()}] Email sent to ${to}`);
      return true;
    } catch (error) {
      console.error(
        `❌ [${new Date().toISOString()}] Error sending email to ${to} (Attempt ${attempt}):`,
        error.message
      );
      if (attempt > retries) return false;
    }
  }
};

module.exports = sendEmail;

