const nodemailer = require("nodemailer");

/**
 * Gmail SMTP via port 587 (STARTTLS).
 * Port 465 often times out on restricted networks — 587 is more reliable.
 *
 * Requires in .env:
 *   MAIL_USER=your@gmail.com
 *   MAIL_PASSWORD=<Gmail App Password, NOT your regular Gmail password>
 *
 * Create an App Password: Google Account → Security → 2-Step Verification → App passwords
 */
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000
});

module.exports = transporter;
