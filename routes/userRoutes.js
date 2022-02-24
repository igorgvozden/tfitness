const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/')
    .get(authController.protect, authController.restrictTo, userController.getAllUsers);

router.post('/signup', authController.signUp);
router.post('/login', authController.login);

router.post('/forgotpassword', authController.forgotPassword);
router.patch('/resetpassword/:token', authController.resetPassword);
router.patch('/updatepassword', authController.protect, authController.updatePassword);

router.patch('/updateme', authController.protect, userController.updateMe);
router.delete('/deleteme', authController.protect, userController.deleteMe);

router.route('/:id')
    .get(authController.protect, userController.getUser)


module.exports = router;