const leggingsModel = require('../models/leggingsModel');
const AppError = require('../controllers/errorController');

exports.getAllLeggings = async (req, res, next) => {
    try {
        const allLeggigns = await leggingsModel.find(); // mongoose metod za get data iz DB, > model.find({ filter object })

        res.status(200).json({
            status: 'success',
            results: allLeggigns.length,
            user: res.locals.user, // authcontroller.isLoggedIn middleware prosledjuje ovog korisnika ako je ulogovan tj ako postoji cookie kod klijenta
            data: {
                leggings: allLeggigns
            }
        });
    } catch (err) {
        res.status(404).json({
            result: "fail",
            data: err
        });
    };
};

exports.createLegging = async (req, res, next) => {
    try {
        console.log(req.body)
        const newLegging = await leggingsModel.create(req.body);

        res.status(201).json({
            status: 'succes',
            message: 'legging created',
            data: {
                legging: newLegging
            }
        });
    } catch (err) {
        res.status(404).json({
            result: "fail",
            data: err
        });
    };
};

exports.getLegging = async (req, res, next) => {
    try {
        const legging = await leggingsModel.findById(req.params.id)

        res.status(200).json({
            status: 'success',
            data: {
                legging
            }
        })
    } catch (err) {
        res.status(404).json({
            result: "fail",
            data: err
        });
    }
};

exports.updateLegging = async (req, res, next) => {
    try {
        const legging = await leggingsModel.findByIdAndUpdate(req.params.id, req.body, { // ovo je objekat koji je 3 parametar i sluzi konfiguraciji querry-a
            new: true,  // ovo znaci da ce vratiti updatovano objekat kao korisniku kao res
            runValidators: true // ovo ce da pokrene validatore koje smo definisali u modelu
        });

        res.status(200).json({
            status: 'success',
            data: {
                legging
            }
        });
    } catch (err) {
        res.status(404).json({
            result: "fail",
            data: err
        });
    }
};

exports.deleteLeggings = async (req, res, next) => {
    try {
        await leggingsModel.findByIdAndDelete(req.params.id);

        res.status(204).json({    // 204 status No content
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(404).json({
            result: "fail",
            data: err
        });
    };
};