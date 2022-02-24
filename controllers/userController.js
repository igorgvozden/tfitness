const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('../utilities/appError');

// const signToken = function (id) {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRES_IN
//     });
// };

// filter req.body tako da se posalju samo dozvoljena polja za update > updateMe ruta
const filterObj = function (obj, ...allowedFields) {
    const newObj = {};

    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

exports.getAllUsers = async (req, res, next) => {
    try {
        const allUsers = await UserModel.find();

        res.status(200).json({
            status: 'success',
            data: {
                users: allUsers
            }
        })
    } catch (err) {
        next(new AppError('Greska u konekciji!', 404));
    };
};

exports.getUser = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.params.id);

        if (!user) return next(new AppError('Ovaj korisnik ne postoji!', 404));

        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        });
    } catch (err) {
        next(new AppError('Korisnik nije pronadjen!', 404));
    };
};

exports.updateMe = async (req, res, next) => {
    try {
        // 1) napravi error ako korisnik krene na post password
        if (req.body.password || req.body.confirmPassword) {
            return next(new AppError('Ova ruta nije za promenu lozinke', 400));
        };

        // 2) filtriraj polja koja mogu biti updejtovana
        const updates = filterObj(req.body, ['name', 'email', 'telephone', 'address', 'postal', 'city']);

        // 3) update korisnika
        const updatedUser = await UserModel.findByIdAndUpdate(req.user.id, updates, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: 'success',
            data: {
                user: updatedUser
            }
        });
    } catch (err) {
        next(new AppError('Promena nije sacuvana, doslo je do greske!', 500))
    };
};

exports.deleteMe = async (req, res, next) => {
    try {
        UserModel.findByIdAndUpdate(req.user.id, { active: false });

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        next(new AppError('Brisanje nije uspelo, doslo je do greske!', 500))
    }
};
