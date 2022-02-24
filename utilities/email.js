const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1) napravi transporter (servis koji ce slati email)
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            password: process.env.EMAIL_PASSWORD
        }
    });

    // 2) definisi email opcije
    const emailOptions = {
        from: 'tFitness <tfitness@tfitness.rs',
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html:
    };

    // 3) poslaji email
    await transporter.sendMail(emailOptions);
};

module.exports = sendEmail;