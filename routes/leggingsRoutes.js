const express = require('express');
const leggingsController = require('../controllers/leggingsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.isLoggedIn);

router.route('/')
    .get(leggingsController.getAllLeggings)
    .post(authController.protect, authController.restrictTo, leggingsController.createLegging);

router.route('/:id')
    .get(leggingsController.getLegging)
    .patch(authController.protect, authController.restrictTo, leggingsController.updateLegging)
    .delete(authController.protect, authController.restrictTo, leggingsController.deleteLeggings);

module.exports = router;
