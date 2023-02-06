
module.exports = function getPasswordResetRoute(model) {
    require("dotenv").config();
    const express = require('express');
    const router = express.Router();
    const apiAuthMiddleware = require("../middlewares/api-auth-middleware");
    const { validationResult } = require('express-validator');
    const passwordResetValidator = require("../validators/password_reset_validator")(model);
    const PasswordReset = require("../models/password_reset");
    const randomNumberGenerator = require("../utils/random_number_generator");
    const smsSender = require("../services/sms_sender");

    router.post("/send/password/reset/code", apiAuthMiddleware, passwordResetValidator.sendPasswordResetCodeValidator, async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid input(s) supplied.',
                errors: errors.array()
            });
        }
        const resetCodeExpiryTimeInHours = process.env.PASSWORD_RESET_CODE_EXPIRY_TIME_IN_HOURS;
        const reset_code = randomNumberGenerator(5);
        const country_code = req.body.country_code;
        const phone_number = req.body.phone_number;
        const user = await model.findOne({ country_code, phone_number });
        const user_id = user._id;
        const sent_date = new Date();

        //Send Forgot Password SMS
        const appName = process.env.APP_NAME;
        const message = `Your ${appName} password reset code is ${reset_code}`;
        await smsSender.sendSMS(country_code, phone_number, message);

        //Create Password Reset Request
        const dataToBeCreated = {
            country_code,
            phone_number,
            reset_code,
            user_id,
            sent_date,
        };
        let newPasswordReset = new PasswordReset(dataToBeCreated);
        await newPasswordReset.save();
        res.json({ status: "success", message: "Password reset code has been sent successfully to your phone", reset_code_expiry_time_in_hours: resetCodeExpiryTimeInHours });
    });

    router.post("/verify/code", apiAuthMiddleware, passwordResetValidator.verifyPasswordResetCodeValidator, async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid input(s) supplied.',
                errors: errors.array()
            });

        }

        const reset_code = req.body.password_reset_code;
        const country_code = req.body.country_code;
        const phone_number = req.body.phone_number;
        const filter = { reset_code, country_code, phone_number };
        const dataToBeUpdated = { is_verified: 1 };
        const passwordReset = await PasswordReset.findOneAndUpdate(filter, dataToBeUpdated);
        const user_id = passwordReset.user_id;
        return res.json({ status: "success", message: "Password reset code verified successfully", user_id });
    });

    return router;

}