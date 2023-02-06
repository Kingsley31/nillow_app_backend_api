const { validationResult, body, param } = require('express-validator');
const vendorRepository = require("../repositories/vendor_repository");
const vendorServiceCategoryRepository = require("../repositories/vendor_service_category_repository");
const vendorServiceRepository = require("../repositories/vendor_service_repository");
const stringCustomFunctions = require("../utils/string_custom_functions");
const { GENDER_SERVICE_TYPES, VENDOR_SERVICE_STATUS_TYPES, LOCATION_PREFERENCE_TYPES } = require("../constants/app_constants");


module.exports.addVendorServiceValidator = async (req) => {
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
        body('service_category_id')
            .custom((value, { req }) => {
                return vendorServiceCategoryRepository.findVendorServiceCategoryById(value).then(vendorServiceCategory => {
                    if (!vendorServiceCategory) {
                        return Promise.reject("Unauthorized Vendor Service Category doesn't exist.");
                    }
                });
            })
            .bail(),
        body('service_name')
            .isString()
            .notEmpty()
            .bail()
            .customSanitizer(value => {
                return stringCustomFunctions.toTitleCase(value.trim());
            }).custom((value, { req }) => {
                return vendorServiceRepository.vendorServiceNameExist(req.params.service_category_id, value).then(serviceNameExist => {
                    if (serviceNameExist) {
                        return Promise.reject("Service category already exist.");
                    }
                });
            }),
        body('cost')
            .isNumeric()
            .notEmpty(),
        body('service_description')
            .isString()
            .notEmpty()
            .bail()
            .customSanitizer(value => {
                return stringCustomFunctions.toSentenceCase(value.trim());
            }),
        body('duration_in_minutes')
            .isInt()
            .notEmpty(),
        body('target')
            .isString()
            .notEmpty()
            .toLowerCase()
            .isIn(GENDER_SERVICE_TYPES)
            .withMessage("Should be women or men or both"),
        body('service_status')
            .isString()
            .notEmpty()
            .toLowerCase()
            .isIn(VENDOR_SERVICE_STATUS_TYPES)
            .withMessage("Should be public or private"),
        body('extra_time_start_point')
            .isInt()
            .notEmpty(),
        body('location_preference')
            .isString()
            .notEmpty()
            .toLowerCase()
            .isIn(LOCATION_PREFERENCE_TYPES)
            .withMessage("Should be on or off"),
        body('staff_ids')
            .optional()
            .isArray()
            .notEmpty(),

    ];

    await Promise.all(validations.map(validation => validation.run(req)));
    return validationResult(req);
};


module.exports.updateVendorServiceValidator = async (req) => {
    const validations = [
        param('service_id')
            .custom(value => {
                return vendorServiceRepository.findVendorServiceById(value).then(vendorService => {
                    if (!vendorService) {
                        return Promise.reject("Unauthorized Vendor Service doesn't exist.");
                    }
                });
            })
            .bail(),
        body('service_category_id')
            .custom((value, { req }) => {
                return vendorServiceCategoryRepository.findVendorServiceCategoryById(value).then(vendorServiceCategory => {
                    if (!vendorServiceCategory) {
                        return Promise.reject("Unauthorized Vendor Service Category doesn't exist.");
                    }
                });
            })
            .bail(),
        body('service_name')
            .optional()
            .isString()
            .notEmpty()
            .bail()
            .customSanitizer(value => {
                return stringCustomFunctions.toTitleCase(value.trim());
            }).custom((value, { req }) => {
                return vendorServiceRepository.vendorServiceNameExist(req.body.service_category_id, value).then(serviceNameExist => {
                    if (serviceNameExist) {
                        return Promise.reject("Service category already exist.");
                    }
                });
            }),
        body('cost')
            .optional()
            .isNumeric()
            .notEmpty(),
        body('service_description')
            .optional()
            .isString()
            .notEmpty()
            .bail()
            .customSanitizer(value => {
                return stringCustomFunctions.toSentenceCase(value.trim());
            }),
        body('duration_in_minutes')
            .optional()
            .isInt()
            .notEmpty(),
        body('target')
            .optional()
            .isString()
            .notEmpty()
            .toLowerCase()
            .isIn(GENDER_SERVICE_TYPES)
            .withMessage("Should be women or men or both"),
        body('service_status')
            .optional()
            .isString()
            .notEmpty()
            .toLowerCase()
            .isIn(VENDOR_SERVICE_STATUS_TYPES)
            .withMessage("Should be public or private"),
        body('extra_time_start_point')
            .optional()
            .isInt()
            .notEmpty(),
        body('location_preference')
            .optional()
            .isString()
            .notEmpty()
            .toLowerCase()
            .isIn(LOCATION_PREFERENCE_TYPES)
            .withMessage("Should be on or off"),
        body('staff_ids')
            .optional()
            .isArray()
            .notEmpty(),

    ];
    await Promise.all(validations.map(validation => validation.run(req)));
    return validationResult(req);
};


module.exports.deleteVendorServiceValidator = async (req) => {
    const validations = [
        param('vendor_id')
            .custom((value, { req }) => {
                if (value !== req.user._id && req.user.role != "admin") {
                    throw new Error('Unauthorized User.');
                }
                return true;
            })
            .bail()
            .custom((value, { req }) => {
                return vendorServiceRepository.findOneVendorService({ vendor: value, _id: req.params.service_id }).then(vendorServiceCategory => {
                    if (!vendorServiceCategory) {
                        return Promise.reject("Unauthorized Vendor doesn't exist.");
                    }
                });
            })
            .bail(),
        param('service_id')
            .custom((value, { req }) => {
                return vendorServiceRepository.findVendorServiceById(value).then(vendorService => {
                    if (!vendorService) {
                        return Promise.reject("Unauthorized Action.");
                    }
                });
            })
            .bail(),
    ];

    await Promise.all(validations.map(validation => validation.run(req)));
    return validationResult(req);
};

module.exports.getVendorServiceCategoryServicesValidator = async (req) => {
    const validations = [
        body('service_category_id')
            .custom((value, { req }) => {
                return vendorServiceCategoryRepository.findVendorServiceCategoryById(value).then(vendorServiceCategory => {
                    if (!vendorServiceCategory) {
                        return Promise.reject("Unauthorized Vendor Service Category doesn't exist.");
                    }
                });
            })
    ];

    await Promise.all(validations.map(validation => validation.run(req)));
    return validationResult(req);
};

module.exports.getVendorServicesValidator = async (req) => {
    const validations = [
        param("vendor_id")
            .custom((value, { req }) => {
                if (value !== req.user._id && req.user.role != "admin") {
                    throw new Error('Unauthorized User.');
                }
                return true;
            })
            .bail()
            .custom((value, { req }) => {
                return vendorRepository.findVendorById(value).then(vendor => {
                    if (!vendor) {
                        return Promise.reject("Unauthorized Vendor doesn't exist.");
                    }
                });
            })
    ];

    await Promise.all(validations.map(validation => validation.run(req)));
    return validationResult(req);
};

