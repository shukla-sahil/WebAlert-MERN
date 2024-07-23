const axios = require('axios');
const Organization = require('../models/Organization');
const nodemailer = require('nodemailer');

// Configure the email transport using your email credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject,
    text: `${text}\n\nIf you are deciding to no longer operate this URL, we suggest you remove it from your account.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      console.log('EMAIL:', process.env.EMAIL);
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};
 
module.exports = sendEmail;
