const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 5000,  // 5 seconds max — never hang the server
  greetingTimeout: 5000,
  socketTimeout: 5000,
});

module.exports = transporter;
