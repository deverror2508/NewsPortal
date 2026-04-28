const nodemailer = require('nodemailer');

async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📧 TEMPORARY SMTP CREDENTIALS GENERATED');
  console.log(`Host: ${testAccount.smtp.host}`);
  console.log(`Port: ${testAccount.smtp.port}`);
  console.log(`User: ${testAccount.user}`);
  console.log(`Pass: ${testAccount.pass}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\nCopy these values into your .env file to test the email functionality.');
  console.log(`You can view sent emails at: ${testAccount.web}`);
}

main().catch(console.error);
