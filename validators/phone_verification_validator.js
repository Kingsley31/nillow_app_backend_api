const { validationResult, body, param } = require('express-validator');
const phoneVericationRepository = require("../repositories/phone_verification_repository");

module.exports.sendOtpToPhoneNumberValidator = async (req) => {
    const validations = [
        body("country_code")
            .notEmpty()
            .isString()
            .custom(value => {
                const regex = /^\+?\d+$/;
                if (!regex.test(value)) {
                    throw new Error('Invalid country code');
                }
                return true;
            }),
        body("phone_number")
            .notEmpty()
            .isString()
            .custom(value => {
                const regex = /^\d{6,25}$/;
                if (!regex.test(value)) {
                    throw new Error('Invalid phone number');
                }
                return true;
            }),
    ];
    await Promise.all(validations.map(validation => validation.run(req)));
    return validationResult(req);
};


module.exports.resendOtpToPhoneNumberValidator = async (req) => {
    const validations = [
        body("country_code")
            .notEmpty()
            .isString()
            .custom(value => {
                const regex = /^\+?\d+$/;
                if (!regex.test(value)) {
                    throw new Error('Invalid country code');
                }
                return true;
            }),
        body("phone_number")
            .notEmpty()
            .isString()
            .custom(async (value, { req }) => {
                const regex = /^\d{6,25}$/;
                if (!regex.test(value)) {
                    throw new Error('Invalid phone number');
                }
                const phoneVerificationExist = await phoneVericationRepository.phoneVerificationExist(req.body.country_code, value);
                if (!phoneVerificationExist) {
                    throw new Error("Phone number doesn't exist");
                }
                return true;
            }),
    ];

    await Promise.all(validations.map(validation => validation.run(req)));
    return validationResult(req);
};



module.exports.verifyOtpValidator = async (req) => {
    const validations = [
        body("country_code")
            .notEmpty()
            .isString()
            .custom(value => {
                const regex = /^\+?\d+$/;
                if (!regex.test(value)) {
                    throw new Error('Invalid country code');
                }
                return true;
            }),
        body("phone_number")
            .notEmpty()
            .isString()
            .custom(value => {
                const regex = /^\d{6,25}$/;
                if (!regex.test(value)) {
                    throw new Error('Invalid country code');
                }
                return true;
            }),
        body("otp")
            .notEmpty()
            .isString()
            .custom(async (value, { req }) => {
                const countryCode = req.body.country_code;
                const phoneNumber = req.body.phone_number;
                const otp = value;
                const verificationCodeIsCorrect = await phoneVericationRepository.verificationCodeIsCorrect(countryCode, phoneNumber, otp);
                if (!verificationCodeIsCorrect) {
                    throw new Error("Incorrect OTP");
                }
                return true;
            }),
    ];

    await Promise.all(validations.map(validation => validation.run(req)));
    return validationResult(req);
};

