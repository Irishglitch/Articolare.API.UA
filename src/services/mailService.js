export default class MailService {
    function sendMail(mailAddres,subject, body){
        const user = process.env.MAIL_ADDRESS;
        const pass = process.env.PASS;
        var nodemailer = require('nodemailer');

        var transporter = nodemailer.createTransport({
            service: 'outlook',
            auth: {
                user: user,
                pass: pass
            }
        });

        var mailOptions = {
            from: user,
            to: mailAddres,
            subject: subject,
            html: body
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
}