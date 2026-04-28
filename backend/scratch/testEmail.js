require('dotenv').config();
const sendEmail = require('../utils/sendEmail');

async function test() {
  console.log('Testing email configuration...');
  console.log('Email:', process.env.SMTP_EMAIL);
  console.log('Host:', process.env.SMTP_HOST);
  
  try {
    await sendEmail({
      email: process.env.SMTP_EMAIL, // Send to self for test
      subject: 'Test Email Configuration',
      message: 'This is a test email to verify SMTP settings.',
      resetUrl: 'http://localhost:5173/reset-password/testtoken'
    });
    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Failed to send email:');
    console.error(error);
  }
}

test();
