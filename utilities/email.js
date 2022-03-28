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
            return response;
        } catch (error) {
            console.log(error, 'doslo je do greske, pokusajte ponovo')
            return 'doslo je do greske, pokusajte ponovo';
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
        await this.sendEmail(this.passwordReset(), 'Tvoja Lozinka je resetovana');
    };

    async sendOrder(order) {
        // napravi template za order
        order.map((item, i) => {
            return `
            <h3>${i}</h3><br/>
            <p>${item.name}</p><br/>
            <p>${item.color}</p><br/>
            <p>${item.size}</p><br/>
            <p>${item.quantity}</p><br/>
            <p>${item.price}</p><br/>
            `
        }).join('');

        // posalji order
        try {
            const response = this.transporter.sendMail({
                to: `${process.env.ORDER_EMAIL}`,
                from: `tFitness <${process.env.EMAIL_FROM}>`,
                subject: 'Nova Porudzbina!',
                text: order
            });
            // ako je response 250, uspesno je poslat order i posalji order confirmation
            return response;
        } catch (error) {
            // ako je response bilo sta osim 250, vrati poruku da nije uspelo slanje 
            console.log(error);
            return error;
        }
    };

    async orderConfirmation() {

    };

    // EMAIL TEMPLATES
    // 1) welcome email za registraciju
    welcome() {
        return `
        <h1>Dobro Dosli u tFitness</h1>
        <p>Tvoj nalog na tFitness Shopu je uspesno napravljen!</p>
        <p>Uloguj se u svoj nalog i zavrsi podesavanje svojih podataka!</p>
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

    passwordReset() {
        return `
        <h1>tFitness</h1>
        <p>Tvoja Lozinka je resetovana!</p>
        `;
    }

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