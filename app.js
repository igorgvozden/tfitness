const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const AppError = require('./utilities/appError');
const errorHandler = require('./controllers/errorController');

const app = express();

// MIDDLEWARES

app.use(cors());

app.use(express.static(`${__dirname}/images`));
app.use(express.static(`${__dirname}/sass`));
// pravi security http headerse
app.use(helmet());

// blokira previse requestova sa iste IP adrese
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000,   // sat vremena
    max: 100,
    message: 'Stiglo je previse zahteva sa ove IP adrese. Pokusajte ponovo za sat vremena'
});
app.use(limiter);

// daje mogucnost da citas req.body info u json formatu
app.use(express.json());

// blokira NoSQL query injections > npr {"$gt": {""}} // skida sve dollar signe sa unosa
app.use(mongoSanitize());

// data sanitize protiv XSS // skida sav HTML kod sa unosa
app.use(xss());

// ROUTES
const leggingsRouter = require('./routes/leggingsRoutes');
const userRouter = require('./routes/userRoutes');

app.use('/users', userRouter);
app.use('/', leggingsRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Nepostojeca adresa: ${req.originalUrl}`, 404));
});

app.use(errorHandler);

module.exports = app;