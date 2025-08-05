const nodemailer = require('nodemailer');

const sendEmail = async (email, code) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Code',
    text: `Your password reset code is: ${code}`
  });
};

module.exports = sendEmail;
