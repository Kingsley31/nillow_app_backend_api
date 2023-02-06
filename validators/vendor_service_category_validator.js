const { validationResult, body, param } = require('express-validator');
const vendorRepository = require("../repositories/vendor_repository");
const vendorServiceCategoryRepository = require("../repositories/vendor_service_category_repository");
const stringCustomFunctions = require("../utils/string_custom_functions");


module.exports.addVendorServiceCategoryValidator = async (req) => {
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
        body('category_name')
            .isString()
            .notEmpty()
            .bail()
            .customSanitizer(value => {
                return stringCustomFunctions.toTitleCase(value.trim());
            }).custom((value, { req }) => {
                return vendorServiceCategoryRepository.vendorServiceCategoryNameExist(req.params.vendor_id, value).then(serviceCategoryNameExist => {
                    if (serviceCategoryNameExist) {
                        return Promise.reject("Service category already exist.");
                    }
                });
            }),
        body('category_description')
            .isString()
            .notEmpty()
            .bail()
            .customSanitizer(value => {
                return stringCustomFunctions.toSentenceCase(value.trim());
            }),
        body('category_tags')
            .isString()
            .notEmpty()
            .toLowerCase(),
    ];

    await Promise.all(validations.map(validation => validation.run(req)));
    return validationResult(req);
};


module.exports.updateVendorServiceCategoryValidator = async (req) => {
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
        body('category_name')
            .optional()
            .isString()
            .notEmpty()
            .bail()
            .customSanitizer(value => {
                return stringCustomFunctions.toSentenceCase(value.trim());
            }).custom((value, { req }) => {
                return vendorServiceCategoryRepository.vendorServiceCategoryNameExist(req.params.vendor_id, value).then(serviceCategoryNameExist => {
                    if (serviceCategoryNameExist) {
                        return Promise.reject("Service category already exist.");
                    }
                });
            }),
        body('category_description')
            .optional()
            .isString()
            .notEmpty()
            .bail()
            .customSanitizer(value => {
                return stringCustomFunctions.toSentenceCase(value.trim());
            }),
        body('category_tags')
            .optional()
            .isString()
            .notEmpty()
            .bail()
            .toLowerCase(),
    ];

    await Promise.all(validations.map(validation => validation.run(req)));
    return validationResult(req);
};


module.exports.deleteVendorServiceCategoryValidator = async (req) => {
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
                return vendorServiceCategoryRepository.findOneVendorServiceCategory({ vendor: value, _id: req.params.service_category_id }).then(vendorServiceCategory => {
                    if (!vendorServiceCategory) {
                        return Promise.reject("Unauthorized Vendor doesn't exist.");
                    }
                });
            })
            .bail(),
        param('service_category_id')
            .custom((value, { req }) => {
                return vendorServiceCategoryRepository.findVendorServiceCategoryById(value).then(vendorServiceCategory => {
                    if (!vendorServiceCategory) {
                        return Promise.reject("Unauthorized Action.");
                    }
                });
            })
            .bail(),
    ];

    await Promise.all(validations.map(validation => validation.run(req)));
    return validationResult(req);
};

module.exports.getVendorServiceCategoryValidator = async (req) => {
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

