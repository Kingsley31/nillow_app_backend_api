const { validationResult, body, param, query, } = require('express-validator');
const { GENDER_SERVICE_TYPES, SERVICE_PROVIDER_TYPES } = require("../constants/app_constants");
const vendorRepository = require("../repositories/vendor_repository");

module.exports.registerVendorValidator = async (req) => {
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
                const emailExist = await vendorRepository.emailExist(value);
                if (emailExist) {
                    return Promise.reject('email already in use');
                }
            }),
        body('first_name')
            .isString()
            .notEmpty(),
        body('last_name')
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
        body('business_name')
            .isString()
            .notEmpty(),
        body('business_type')
            .isString()
            .notEmpty(),
        body('service_provider_type')
            .isString()
            .notEmpty()
            .isIn(SERVICE_PROVIDER_TYPES),
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


module.exports.loginVendorValidator = async (req) => {
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

module.exports.searchFreelancervalidator = async (req) => {
    const validations = [
        query('service_name')
            .optional()
            .isString()
            .notEmpty(),
        query("latitude")
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
        query("longitude")
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
    ];

    await Promise.all(validations.map(validation => validation.run(req)));
    return validationResult(req);
};
module.exports.updateVendorValidator = async (req) => {
    const validations = [
        param('vendor_id')
            .custom((value, { req }) => {
                if (value !== req.user._id && req.user.role != "admin") {
                    throw new Error('Unauthorized User.');
                }
                return true;
            })
            .bail()
            .custom(value => {
                return vendorRepository.findVendorById(value).then(vendor => {
                    if (!vendor) {
                        return Promise.reject("Unauthorized Vendor doesn't exist.");
                    }
                });
            })
            .bail(),
        body('first_name')
            .optional()
            .isString()
            .notEmpty(),
        body('last_name')
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
        body('street_address')
            .optional()
            .isString()
            .notEmpty(),
        body('city')
            .optional()
            .isString()
            .notEmpty(),
        body('state_or_province')
            .optional()
            .isString()
            .notEmpty(),
        body('postal_code')
            .optional()
            .isString()
            .notEmpty(),
        body('country')
            .optional()
            .isString()
            .notEmpty(),
        body('business_name')
            .optional()
            .isString()
            .notEmpty(),
        body('business_type')
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
        body('service_provider_mode')
            .optional()
            .isString()
            .notEmpty()
            .isIn(SERVICE_PROVIDER_TYPES)
            .withMessage(`Should be ${SERVICE_PROVIDER_TYPES.join(" or ")}`),
    ];
    await Promise.all(validations.map(validation => validation.run(req)));
    return validationResult(req);
};

module.exports.getVendorByIdValidator = async (req) => {
    const validations = [
        param('vendor_id')
            .custom((value, { req }) => {
                return vendorRepository.findVendorById(value).then(vendor => {
                    if (!vendor) {
                        return Promise.reject('Invalid Vendor ID');
                    }
                });
            }),
    ];

    await Promise.all(validations.map(validation => validation.run(req)));
    return validationResult(req);
};



module.exports.updatePasswordValidator = async (req) => {
    const validations = [
        param('vendor_id')
            .custom((value, { req }) => {
                return vendorRepository.findVendorById(value).then(vendor => {
                    if (!vendor) {
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

