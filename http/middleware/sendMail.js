const nodemailer = require('nodemailer');

module.exports = (subject, html) => {
  return new Promise(async (resolve, reject) => {
    try {
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: env('emailUser'),
          pass: env('emailPassword')
        }
      });

      let info = await transporter.sendMail({
        from: env('emailUser'),
        to: env('emailUser'),
        subject,
        text: '',
        html
      });

      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      resolve();
    } catch (e) {
      reject('Internal Server error.');
    }
  });
};
