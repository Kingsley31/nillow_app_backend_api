const { validationResult, body, param } = require("express-validator");
const vendorRepository = require("../repositories/vendor_repository");
const vendorStaffRepository = require("../repositories/vendor_staff_repository");



module.exports.registerVendorStaffValidator = async (req) => {
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
        body('vendor_referral_code')
            .isString()
            .notEmpty()
            .custom(async (val, { req }) => {
                const vendor = await vendorRepository.findOneVendor({ referral_code: val });
                if (!vendor) {
                    throw Error("Invalid vendor referral code,vendor doesn't exist");
                }
            })
            .bail(),
        body('email')
            .isEmail()
            .custom(async (val, { req }) => {
                const vendor = await vendorRepository.findOneVendor({ referral_code: req.body.vendor_referral_code });
                const vendorStaff = await vendorStaffRepository.findOneVendorStaff({ email: val, vendor: vendor._id, is_deleted: 0 });
                if (vendorStaff) {
                    throw Error("Staff already exist");
                }
            }),
        body('first_name')
            .isString()
            .notEmpty(),
        body('last_name')
            .isString()
            .notEmpty(),
        body('business_type')
            .isString()
            .notEmpty(),
        body('assigned_services_ids')
            .optional()
            .isArray()
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


module.exports.loginVendorStaffValidator = async (req) => {
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


module.exports.updateVendorStaffValidator = async (req) => {
    const validations = [
        param('vendor_staff_id')
            .isString()
            .notEmpty()
            .custom(async (val) => {
                const vendorStaff = await vendorStaffRepository.findVendorStaffById(val);
                if (!vendorStaff) {
                    throw Error("Invalid vendor staff ID");
                }
            }),
        body('first_name')
            .optional()
            .isString()
            .notEmpty(),
        body('last_name')
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
            .notEmpty(),
        body('assigned_services')
            .optional()
            .isArray()
            .notEmpty(),

    ];
    await Promise.all(validations.map(validation => validation.run(req)));
    return validationResult(req);
};


module.exports.updatePasswordValidator = async (req) => {
    const validations = [
        param('vendor_staff_id')
            .custom((value, { req }) => {
                return vendorStaffRepository.findVendorStaffById(value).then(vendor => {
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

module.exports.getVendorStaffsByVendorIdValidator = async (req) => {
    const validations = [
        param('vendor_id')
            .custom(async (value) => {
                const vendor = await vendorRepository.findVendorById(value);
                if (!vendor) {
                    throw Error('Invalid vendor ID');
                }
            })
    ];

    await Promise.all(validations.map(validation => validation.run(req)));
    return validationResult(req);
};

module.exports.getVendorStaffByIdValidator = async (req) => {
    const validations = [
        param('vendor_staff_id')
            .custom(async (value) => {
                const vendorStaff = await vendorStaffRepository.findVendorStaffById(value);
                if (!vendorStaff) {
                    throw Error('Invalid vendor staff ID');
                }
            })
    ];

    await Promise.all(validations.map(validation => validation.run(req)));
    return validationResult(req);
};