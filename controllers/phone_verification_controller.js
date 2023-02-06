require("dotenv").config();
const phoneVerificationValidator = require("../validators/phone_verification_validator");
const phoneVericationRepository = require('../repositories/phone_verification_repository');
const randomNumberGenerator = require("../utils/random_number_generator");
const smsSender = require("../services/sms_sender");

module.exports.sendOtpToPhoneNumber = async (req, res, next) => {

    const errors = await phoneVerificationValidator.sendOtpToPhoneNumberValidator(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid input(s) supplied.',
            errors: errors.array()
        });
    }

    const appName = process.env.APP_NAME;
    const phone_number = req.body.phone_number;
    const country_code = req.body.country_code;

    //Check if phone verification exist and return response
    const phoneVerificationExist = await phoneVericationRepository.phoneVerificationExist(country_code, phone_number);
    if (phoneVerificationExist) {
        return res.json({ status: "success", message: "OTP sent successfully." });
    }

    const otp = randomNumberGenerator(4);
    const sent_date = new Date();
    const message = `Your ${appName} phone number verification OTP is: ${otp}`;
    await smsSender.sendSMS(country_code, phone_number, message);
    //Store phone verification
    const phoneVerification = await phoneVericationRepository.storePhoneVerification({ phone_number, country_code, otp, sent_date });
    return res.json({ status: "success", message: "OTP sent successfully." });

};


module.exports.resendOtpToPhoneNumber = async (req, res, next) => {
    const errors = await phoneVerificationValidator.resendOtpToPhoneNumberValidator(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid input(s) supplied.',
            errors: errors.array()
        });
    }


    const phone_number = req.body.phone_number;
    const country_code = req.body.country_code;
    const is_verified = 0;
    //Retrieve the existing phone verification
    const phoneVerification = await phoneVericationRepository.findOnePhoneVerification({ phone_number, country_code, is_verified });
    if (!phoneVerification) {
        return res.status(400).json({
            status: 'error',
            message: 'Phone verification does not exist.',
        });
    }

    const appName = process.env.APP_NAME;
    const otp = randomNumberGenerator(4);
    const sent_date = new Date();
    const message = `Your ${appName} phone number verification OTP is: ${otp}`;
    await smsSender.sendSMS(country_code, phone_number, message);
    await phoneVericationRepository.findByIdAndupdatePhoneVerification(phoneVerification._id, { otp, sent_date });
    return res.json({ status: "success", message: "OTP resent successfully." });
};

module.exports.verifyOtp = async (req, res, next) => {
    const errors = await phoneVerificationValidator.verifyOtpValidator(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid input(s) supplied.',
            errors: errors.array()
        });
    }


    const phone_number = req.body.phone_number;
    const country_code = req.body.country_code;
    const otp = req.body.otp;
    const is_verified = 0;
    //Retrieve the existing phone verification
    const phoneVerification = await phoneVericationRepository.findOnePhoneVerification({ phone_number, country_code, otp, is_verified });
    if (!phoneVerification) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid otp supplied.',
        });
    }


    await phoneVericationRepository.findByIdAndupdatePhoneVerification(phoneVerification._id, { is_verified: 1 });
    res.json({ status: "success", message: "OTP verified successfully." });
};