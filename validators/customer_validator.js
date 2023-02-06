const { validationResult, body, param } = require('express-validator');
const { GENDER_SERVICE_TYPES, SERVICE_PROVIDER_TYPES } = require("../constants/app_constants");
const customerRepository = require("../repositories/customer_repository");

module.exports.registerCustomerValidator = async (req) => {
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
        body('email')
            .isEmail()
            .withMessage('must be a valid email')
            .normalizeEmail()
            .custom(async value => {
                const emailExist = await customerRepository.emailExist(value);
                if (emailExist) {
                    return Promise.reject('email already in use');
                }
            }),
        body('full_name')
            .isString()
            .notEmpty(),
        body('emergency_contact_name')
            .isString()
            .notEmpty(),
        body("emergency_contact_country_code")
            .notEmpty()
            .isString()
            .custom(value => {
                const regex = /^\+?\d+$/;
                if (!regex.test(value)) {
                    throw new Error('Invalid country code');
                }
                return true;
            }),
        body("emergency_contact_phone_number")
            .notEmpty()
            .isString()
            .custom(value => {
                const regex = /^\d{6,25}$/;
                if (!regex.test(value)) {
                    throw new Error('Invalid phone number');
                }
                return true;
            }),
        body('address')
            .isString()
            .notEmpty(),
        body('password')
            .not().isEmpty()
            .withMessage('please enter password')
            .trim()
            .escape()
            .isLength({ min: 5 })
            .withMessage('must be at least 5 chars long')
    ];

    await Promise.all(validations.map(validation => validation.run(req)));
    return validationResult(req);
};


module.exports.loginCustomerValidator = async (req) => {
    const validations = [
        body('email')
            .isEmail()
            .withMessage('must be a valid email')
            .normalizeEmail(),
        body('password')
            .not().isEmpty()
            .withMessage('please enter your password')
            .trim()
            .escape()
    ];
    await Promise.all(validations.map(validation => validation.run(req)));
    return validationResult(req);
};

module.exports.updateCustomerValidator = async (req) => {
    const validations = [
        param('customer_id')
            .custom((value, { req }) => {
                if (value !== req.user._id && req.user.role != "admin") {
                    throw new Error('Unauthorized User.');
                }
                return true;
            })
            .bail()
            .custom(value => {
                return customerRepository.findCustomerById(value).then(customer => {
                    if (!customer) {
                        return Promise.reject("Unauthorized Customer doesn't exist.");
                    }
                });
            })
            .bail(),
        body('full_name')
            .optional()
            .isString()
            .notEmpty(),
        body('emergency_contact_name')
            .optional()
            .isString()
            .notEmpty(),
        body("emergency_contact_country_code")
            .optional()
            .notEmpty()
            .isString()
            .custom(value => {
                const regex = /^\+?\d+$/;
                if (!regex.test(value)) {
                    throw new Error('Invalid country code');
                }
                return true;
            }),
        body("emergency_contact_phone_number")
            .optional()
            .notEmpty()
            .isString()
            .custom(value => {
                const regex = /^\d{6,25}$/;
                if (!regex.test(value)) {
                    throw new Error('Invalid phone number');
                }
                return true;
            }),
        body('address')
            .optional()
            .isString()
            .notEmpty(),
        body('profile_avatar_url')
            .optional()
            .isURL()
            .isString()
            .notEmpty(),
        body("latitude")
            .optional()
            .isString()
            .notEmpty()
            .custom(value => {
                try {
                    const latitude = parseFloat(value);
                    if (!latitude) {
                        throw new Error('Invalid latitude. Example latitude format is 26.917');
                    }
                } catch (error) {
                    throw new Error('Invalid latitude. Example latitude format is 26.917');
                }
                return true;
            }),
        body("longitude")
            .optional()
            .isString()
            .notEmpty()
            .custom(value => {
                try {
                    const longitude = parseFloat(value);
                    if (!longitude) {
                        throw new Error('Invalid longitude. Example longitude format is 26.917');
                    }
                } catch (error) {
                    throw new Error('Invalid longitude. Example longitude format is 26.917');
                }
                return true;
            }),
        body('preffered_gender_service_type')
            .optional()
            .isString()
            .notEmpty()
            .isIn(GENDER_SERVICE_TYPES),
        body("preffered_service_provider_type")
            .optional()
            .isString()
            .notEmpty()
            .isIn(SERVICE_PROVIDER_TYPES),
    ];
    await Promise.all(validations.map(validation => validation.run(req)));
    return validationResult(req);
};


module.exports.updatePasswordValidator = async (req) => {
    const validations = [
        param('customer_id')
            .custom((value, { req }) => {
                return customerRepository.findCustomerById(value).then(customer => {
                    if (!customer) {
                        return Promise.reject('Unauthorized Action.');
                    }
                });
            }),
        body('new_password')
            .not().isEmpty()
            .withMessage('please enter new password')
            .trim()
            .escape()
            .isLength({ min: 5 })
    ];

    await Promise.all(validations.map(validation => validation.run(req)));
    return validationResult(req);
};


module.exports.getCustomerByIdValidator = async (req) => {
    const validations = [
        param('customer_id')
            .custom((value, { req }) => {
                return customerRepository.findCustomerById(value).then(customer => {
                    if (!customer) {
                        return Promise.reject('Invalid Customer ID');
                    }
                });
            }),
    ];

    await Promise.all(validations.map(validation => validation.run(req)));
    return validationResult(req);
};

