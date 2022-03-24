const nodemailer = require('nodemailer');

// new Email(user, url).sendWelcome(template, subject);

class Email {
    constructor(user, url) {
        this.to = user.email,
            this.name = user.name,
            this.url = url,
            this.from = `t fitness <${process.env.EMAIL_FROM}>`;
    };

    transporter = nodemailer.createTransport({
        service: 'SendinBlue', // nema potrebe za postavljanje Hosta jer nodemailer ima servise za Sendinblue
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    async sendEmail(template, subject) {
        try {
            const response = await this.transporter.sendMail({
                to: this.to,
                from: this.from,
                subject,
                text: template
            });
            console.log(response);
        } catch (error) {
            console.log(error, 'doslo je do greske, pokusajte ponovo')
        }
    };

    // EMAIL METODE
    async sendWelcome() {
        await this.sendEmail(this.welcome(), 'Dobro Dosli u tFitness!');
    };

    async sendForgotPassword() {
        await this.sendEmail(this.frogotPassword(), 'Zahtev za promenu lozinke (vazi narednih 10 minuta)');
    };

    async sendResetPassword() {

    };

    async sendOrder() {

    };

    async orderConfirmation() {

    };

    // EMAIL TEMPLATES
    // 1) welcome email za registraciju
    welcome() {
        return `
        <h1>Dobro Dosli u tFitness</h1>
        <p>Tvoj nalog na tFitness Shopu je uspesno napravljen!</p>
        `;
    };

    // 2) zaboravljena lozinka
    frogotPassword() {
        return `
        <h1>tFitness</h1>
        <p>Postavi svoju novu lozinku prateci sledeci link: <a href="${this.url}" target="blank">Promena Lozinke</a></p>
        <p>Ako niste zatrazili promenu lozinke, zanemarite ovaj email.</p>
        `;
    };

};

module.exports = Email;
///////////////////////////

// const transporter = nodemailer.createTransport({
//     service: 'SendinBlue', // nema potrebe za postavljanje Hosta jer nodemailer ima servise za Sendinblue
//     auth: {
//         user: process.env.EMAIL_USERNAME,
//         pass: process.env.EMAIL_PASSWORD
//     }
// });

// const sendEmail = async () => {
//     try {
//         const response = await
//             transporter.sendMail({
//                 to: 'igor@mailsac.com',
//                 from: `tFitness <${process.env.EMAIL_FROM}>`,
//                 subject: 'test',
//                 text: 'test mail'
//             });
//         console.log(response)

//     } catch (error) {
//         console.log(error, 'doslo je do greske, pokusajte ponovo')
//     }
// };

// module.exports = sendEmail;