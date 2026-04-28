const nodemailer = require('nodemailer');

/**
 * Send an email using Nodemailer
 * @param {Object} options - Email options
 * @param {string} options.email - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.message - Plain text message
 * @param {string} options.html - HTML content (optional)
 */
const sendEmail = async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // Calculate the HTML template if not provided
  const htmlTemplate = options.html || `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f4f7f9;
          margin: 0;
          padding: 0;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }
        .header {
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
          color: white;
          padding: 40px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        .content {
          padding: 40px 30px;
          line-height: 1.6;
        }
        .content p {
          margin-bottom: 25px;
          font-size: 16px;
          color: #555;
        }
        .btn-container {
          text-align: center;
          margin: 35px 0;
        }
        .btn {
          background-color: #2a5298;
          color: white !important;
          padding: 15px 35px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          display: inline-block;
          transition: background-color 0.3s ease;
          box-shadow: 0 4px 15px rgba(42, 82, 152, 0.3);
        }
        .footer {
          padding: 30px;
          background-color: #f9fafb;
          text-align: center;
          font-size: 12px;
          color: #888;
          border-top: 1px solid #eee;
        }
        .footer p {
          margin: 5px 0;
        }
        .link-fallback {
          word-break: break-all;
          color: #2a5298;
          font-size: 13px;
        }
        .divider {
          height: 1px;
          background-color: #eee;
          margin: 30px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>You are receiving this email because a password reset request was made for your account. Please click the button below to set a new password:</p>
          
          <div class="btn-container">
            <a href="${options.resetUrl}" class="btn">Reset Password</a>
          </div>
          
          <p>This password reset link will expire in 10 minutes. If you did not request a password reset, please ignore this email or contact support.</p>
          
          <div class="divider"></div>
          
          <p style="font-size: 13px;">If the button above doesn't work, copy and paste the following link into your browser:</p>
          <p class="link-fallback">${options.resetUrl}</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} NewsPortal. All rights reserved.</p>
          <p>This is an automated message, please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Send mail with defined transport object
  const info = await transporter.sendMail({
    from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: htmlTemplate,
  });

  console.log('Message sent: %s', info.messageId);
  
  // Log the Ethereal preview URL if using ethereal email
  if (process.env.SMTP_HOST.includes('ethereal')) {
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
};

module.exports = sendEmail;
