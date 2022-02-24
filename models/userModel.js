const crypto = require('crypto'); // mongoose built in metoda za random kreiranje tokena
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Unesite Vaše ime.']
    },
    postal: {
        type: String,
        required: [true, 'Unesite postanski broj'],
        min: [5, 'Postanski broj mora imati 5 brojeva'],
        max: [5, 'Postanski broj mora imati 5 brojeva'],
        trim: true
    },
    city: {
        type: String,
        required: [true, 'Unesite ime vaseg mesta. Na primer: Kragujevac']
    },
    address: {
        type: String,
        required: [true, 'Unesite adresu! Na primer: Bulevar Oslobodjenja 16/c/9'],
    },
    telephone: {
        type: String,
        required: [true, 'Unesite broj telefona!']
    },
    password: {
        type: String,
        required: [true, 'Unesite željenu lozinku'],
        trim: true,
        select: false // ovo nece vracati pass kada budemo radili querry sa korisnicima
    },
    confirmPassword: {
        type: String,
        required: [true, 'Potvrdite lozinku.'],
        trim: true,
        select: false,
        validate: {
            // ovo radi samo na CREATE i SAVE!!!
            validator: function (el) {
                return el === this.password;
            },
            message: 'Lozinka je pogresna, ponovo potvrdite lozinku!'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpres: Date,
    email: {
        type: String,
        required: [true, 'Unesite Vašu email adresu'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Proverite format email adrese.']
    },
    admin: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ovde treba ath uraditi u middle pre save
userSchema.pre('save', async function (next) {
    // pokreni funkciju samo ako je pass modifikivan
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);

    this.confirmPassword = undefined; // da se ne bi sacuvao u DB
    next();
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000; // desava se da token bude izdat pre upisivanja u DB pa korisnik ne moze da se uloguje zbog passa koji je noviji od tokena
    next();
});

// query middleware za filterovanje obrisanih, neaktivnhh korisnika
userSchema.pre(/^find/, function (next) {
    // odnosi se na current query
    this.find({ active: { $ne: false } });
    next();
});

//////////// VIRTUALS

userSchema.virtual('adminPanelUrl').get(function () {
    if (this.admin) return process.env.ADMIN_PANEL_URL;
});

//////////// INSTANCE FUNCTIONS

// proveri da li je password menjan nakon sto je napravljen token za signup/login
userSchema.methods.changedPassword = function (JWTtimeStamp) {
    if (this.passwordChangedAt) {
        const updatedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return updatedTimestamp > JWTtimeStamp;
    };
};

// reset passworda korisnika koji saljemo na mail kada zatrazi reset
userSchema.methods.createResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    console.log({ resetToken }, this.passwordResetToken);

    this.passwordResetExpres = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

///////////////////////

const User = mongoose.model('User', userSchema);

module.exports = User;