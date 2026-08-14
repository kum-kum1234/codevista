const express = require('express');
const authController = require('../../controllers/auth.controller');
const auth = require('../../middlewares/auth.middleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);
router.post('/google', authController.googleLogin);
router.get('/me', auth, authController.getMe);


module.exports = router;