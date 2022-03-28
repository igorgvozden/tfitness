const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const AppError = require("../utilities/appError");
const User = require("../models/userModel");
// const sendEmail = require('../utilities/email');
const Email = require('../utilities/email');

// const signToken = function (id) {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRES_IN
//     });
// };

const createAndSendCookie = (user, responseCode, res) => {
    const signToken = function (id) {
        return jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });
    };

    const token = signToken(user._id);

    res.cookie('jwt', token, {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        // secure: true, // samo u produkciji je true, inace nece raditi zbog https
        httpOnly: true
    });

    res.status(responseCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};

exports.protect = async (req, res, next) => {
    try {
        let token = '';

        // 1) pogledaj ima li korisnik token

        // if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        //     token = req.headers.authorization.split(' ')[1];
        // };

        if (req.headers.cookie && req.headers.cookie.startsWith('jwt')) {
            token = req.headers.cookie.split('=')[1];
        };
        if (!token) return next(new AppError('Ulogujte se da biste dobili pristup.', 401));

        // 2) verifikacija tokena
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);

        // 3) da li korisnik postoji u db
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) return next(new AppError('Korisnik vise ne postoji!', 401));

        // 4) da li je korisnik promenio password nakon sto je dobio svoj jwt token
        // u modelu namesti datum kada je menjan password
        // uporedi datume kada je menjan pass sa decoded.iat koji pokazuje vreme izdavanja tokena
        // ako je menjan i token je izdat pre toga, vrati error 401
        if (currentUser.changedPassword(decoded.iat)) {
            return next(new AppError('Lozinka je promenjena. Ulogujte se ponovo!', 401));
        };

        // Dozvoli pristup na Protected Route
        req.user = currentUser;    // ako bude zatrebao ovaj korisnik kasnije u kodu za autorizaciju
        next();
    } catch (err) {
        next(new AppError('auth error', 401));
    };
};

exports.isLoggedIn = async (req, res, next) => {
    try {
        let token = '';

        if (req.headers.cookie && req.headers.cookie.startsWith('jwt')) {
            token = req.headers.cookie.split('=')[1];

            if (!token) return next();

            // 2) verifikacija tokena
            const decoded = await jwt.verify(token, process.env.JWT_SECRET);

            // 3) da li korisnik postoji u db
            const currentUser = await User.findById(decoded.id);
            if (!currentUser) return next(new AppError('Korisnik vise ne postoji!', 401));

            // 4) da li je korisnik promenio password nakon sto je dobio svoj jwt token

            if (currentUser.changedPassword(decoded.iat)) {
                return next(new AppError('Lozinka je promenjena. Ulogujte se ponovo!', 401));
            };

            //////////
            res.locals.user = currentUser; // locals je kontejner za varijable koje ce u ovom slucaju da se storuju samo na responsu(posoji i app.locals vidi doc)

            return next();
        };
        next();
    } catch (err) {
        console.log(err);
        next();
    };
};

exports.logout = async function (req, res, next) {
    try {
        res.cookie('jwt', '', {
            expires: new Date(Date.now()),
            // secure: true, // samo u produkciji je true, inace nece raditi zbog https
            httpOnly: true
        });

        res.send({
            status: 'success',
            message: 'Izlogovani ste!'
        });
    } catch (error) {
        next(new AppError('Oooppps, doslo je do greske! probajte ponovo', 500));
    };
};

exports.restrictTo = async (req, res, next) => {
    if (!req.user.admin) return next(new AppError('Pristup nije dozvoljen', 403));
    next();
};

exports.signUp = async (req, res, next) => {
    try {
        const { name, email, password, confirmPassword, telephone, address, postal, city } = req.body;

        // 1) da li su popunjena sva polja
        if (!name || !email || !password || !confirmPassword) {
            return next(new AppError('Popunite sva polja', 400));
        };

        // 2) da li je password jednak confirm password
        if (password !== confirmPassword) return next(new AppError('Lozinka i Potvrda Lozinke nisu iste'));

        // 3) da li je email unikatan
        const userEmail = await User.findOne({ email });
        if (userEmail) return next(new AppError('Email vec postoji', 500));

        // 4) kreiraj korisnika u db
        const newUser = await User.create({
            name,
            email,
            password,
            confirmPassword,
            // telephone,
            // address,
            // postal,
            // city
        });

        // const token = signToken(newUser._id);

        // // skloni password iz responsa
        newUser.password = undefined;

        // res.status(201).json({
        //     status: 'Success',
        //     token,
        //     message: 'User registered',
        //     data: {
        //         user: newUser
        //     }
        // });

        // 5) posalji email korisniku da se registrovao
        Email(newUser).sendWelcome();

        // ovde bi trebalo sacuvati token u cookie
        createAndSendCookie(newUser, 201, res)
    } catch (err) {
        console.log(err);
        next(new AppError(err.message, 500));
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 1) da li email i pass postoje
        if (!email || !password) {
            return next(new AppError('Unesite email ili lozinku', 400))
        }
        // 2) da li korisnik postoji i da li je pass u redu
        const user = await User.findOne({ email }).select('+password');

        if (!user || !await bcrypt.compare(password, user.password)) {
            return next(new AppError('Email ili Lozinka su netacni.', 401));
        };
        // 3) ako su prve dve u redu, posalji token nazad klijentu
        user.password = undefined;

        // new Email(user).sendWelcome();
        createAndSendCookie(user, 200, res);

        // const token = signToken(user._id);
        // res.status(200).json({
        //     status: 'Success',
        //     token
        // });
    } catch (err) {
        next(new AppError('Greska pri logovanju', 401))
    };
};


exports.forgotPassword = async (req, res, next) => {
    // 1) pronadji korisnika pomocu email adrese
    const user = await User.findOne({ email: req.body.email });
    // 2) napravi random reset token
    const resetToken = user.createResetPasswordToken();
    await user.save({ validateBeforeSave: false }); // ovo ce da iskljuci validatore u schemi

    try {
        // 3) posalji mu to na email
        const resetURL = `${req.protocol}://${req.get('host')}/users/resetpassword/${resetToken}`; // ovo je url za forgotPass route
        const mailResetURL = `${process.env.FRONT_END_URL}/?#reset=${resetToken}`; // ovo je url da korisnik moze iz dobijenog mejla za eset pass da se preusmeri na sajt
        new Email(user, mailResetURL).sendForgotPassword();

        res.status(200).json({
            status: 'success',
            message: 'zahtev je prosleđen na tvoj email!'
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        console.log(err);
        return next(new AppError('doslo je do greske, molim Vas pokusajte ponovo!', 500));
    };
};

exports.resetPassword = async (req, res, next) => {
    // 1) pronadji korisnika po tokenu koji se dobija iz forgot password
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken, passwordResetExpires: {
            $gt: Date.now()
        }
    });

    // 2) ako token nije istekao i postoji korisnik, postavi novi password
    if (!user) return next(new AppError('Vreme za promenu Lozinke je isteklo!', 400));

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    // 3) promeni passwordChangedAt u schemi
    user.passwordChangedAt = Date.now();

    await user.save();

    new Email(user).passwordReset();
    // 4) login korisnika, posalji mu novi JWT
    createAndSendCookie(user, 200, res);

    // const signToken = function (id) {
    //     return jwt.sign({ id }, process.env.JWT_SECRET, {
    //         expiresIn: process.env.JWT_EXPIRES_IN
    //     });
    // };

    // res.status(200).json({
    //     status: 'success',
    //     token: signToken
    // });
};

// vazi za ulogovane korisnike koji hoce da promene pass
exports.updatePassword = async (req, res, next) => {
    // 1) pronadji korisnika u db
    const user = await UserModel.findById(req.user.id).select('+password');
    if (!user) return next(new AppError('Korisnik ne postoji u db', 404));

    // 2) da bi promenio pass, mora znati svoj stari pass.. Proveri da li je stari pass ok
    if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
        return next(new AppError('Lozinka nije ispravna', 401));
    };

    // 3) update password // na ovaj nacin cuvam jer mi treba save() da bi middle pre save radili i pass radi samo na save i create(vidi model)
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();

    // 4) login korisnika
    createAndSendCookie(user, 200, res);

    // const token = signToken(user._id);
    // res.status(200).json({
    //     status: 'Success',
    //     token
    // });
};