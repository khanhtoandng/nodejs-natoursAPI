
const express = require('express');
const userController = require('./../controllers/userControllers');
const authController = require('./../controllers/authController');
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword/:token', authController.resetPassword);;

router.patch('/updatePassword', authController.protect , authController.updatePassword);

router.patch('/updateMe', authController.protect, userController.updateMe);
router.patch('/deleteMe', authController.protect, userController.deleteMe);


router
    .route('/')
    .get(userController.getAllUsers)

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(
        authController.protect,
        authController.restrictTo('admin'),
        userController.deleteUser
    );

    
module.exports = router;