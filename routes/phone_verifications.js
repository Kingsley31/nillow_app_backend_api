const express = require('express');
const router = express.Router();

const apiAuthMiddleware = require("../middlewares/api-auth-middleware");
const phoneVerificationController = require("../controllers/phone_verification_controller");





/* POST Send OTP Route */
router.post('/send/otp', apiAuthMiddleware, phoneVerificationController.sendOtpToPhoneNumber);


/* PUT Resend OTP Route */
router.put('/resend/otp', apiAuthMiddleware, phoneVerificationController.resendOtpToPhoneNumber);


/* PUT Verify OTP Route */
router.put('/verify/otp', apiAuthMiddleware, phoneVerificationController.verifyOtp);

module.exports = router;