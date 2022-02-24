const dotenv = require('dotenv'); //env variables
dotenv.config({ path: './config.env' });

const mongoose = require('mongoose');

const database = process.env.DATABASE.replace('<password>', process.env.PASSWORD);
mongoose.connect(database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Database Connected'));

const app = require('./app');

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`App is running at ${port}...`);
});

// Event listener na serveru za asinhrone funkcije koje imaju veze sa konekcijom sa serverom
process.on('unhandledRejection', err => {
    console.log('Unhandled Rejection, Shutting Down...');
    console.log(err);

    server.close(() => {
        process.exit(1); // parametar moze biti 0: Success, i 1: Uncaught Exception
    });
});

// Event listener na serveru za asinhrone funkcije koje imaju veze sa sinhronim kodom i greskama u kodu
process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION, Shutting Down...');
    console.log(err.name, err.message);

    process.exit(1);
});
