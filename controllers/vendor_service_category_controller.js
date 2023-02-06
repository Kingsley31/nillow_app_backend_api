
const vendorRepository = require("../repositories/vendor_repository");
const vendorServiceCategoryRepository = require("../repositories/vendor_service_category_repository");
const vendorServiceCategoryValidator = require("../validators/vendor_service_category_validator");



module.exports.addVendorServiceCategory = async (req, res, next) => {
    const errors = await vendorServiceCategoryValidator.addVendorServiceCategoryValidator(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid input(s) supplied.',
            errors: errors.array()
        });
    }

    const vendor_id = req.params.vendor_id;
    const category_name = req.body.category_name;
    const category_description = req.body.category_description;
    const category_tags = req.body.category_tags;
    const vendorServiceCategory = await vendorServiceCategoryRepository.storeVendorServiceCategory({ vendor: vendor_id, category_name, category_description, category_tags });
    const vendor = await vendorRepository.findVendorByIdRaw(vendor_id);
    vendor.service_categories.push(vendorServiceCategory);
    await vendor.save();
    res.json({ status: "success", message: "Service category added successfully!!", service_category: vendorServiceCategory });

};


module.exports.updateVendorServiceCategory = async (req, res, next) => {
    const errors = await vendorServiceCategoryValidator.updateVendorServiceCategoryValidator(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid input(s) supplied.',
            errors: errors.array()
        });
    }
    const dataTobeUpdate = {};
    const service_category_id = req.body.service_category_id;
    const vendor = req.params.vendor_id;
    req.body.category_name ? dataTobeUpdate.category_name = req.body.category_name : null;
    req.body.category_description ? dataTobeUpdate.category_description = req.body.category_description : null;
    req.body.category_tags ? dataTobeUpdate.category_tags = req.body.category_tags : null;
    const vendorServiceCategory = await vendorServiceCategoryRepository.findByIdAndupdateVendorServiceCategory(service_category_id, dataTobeUpdate);
    res.json({ status: "success", message: "Service category updated successfully!!", service_category: vendorServiceCategory });
};



module.exports.deleteVendorServiceCategory = async (req, res, next) => {
    const errors = await vendorServiceCategoryValidator.deleteVendorServiceCategoryValidator(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid input(s) supplied.',
            errors: errors.array()
        });
    }
    const vendor_id = req.params.vendor_id;
    const service_category_id = req.params.service_category_id;
    await vendorServiceCategoryRepository.deleteVendorServiceCategory(service_category_id);
    const vendor = await vendorRepository.findVendorByIdRaw(vendor_id);
    vendor.service_categories.pop(service_category_id);
    await vendor.save();
    res.json({ status: "success", message: "Service category deleted successfully!!" });
};


module.exports.getVendorServiceCategory = async (req, res, next) => {
    const errors = await vendorServiceCategoryValidator.getVendorServiceCategoryValidator(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid input(s) supplied.',
            errors: errors.array()
        });
    }

    const vendor_id = req.params.vendor_id;
    const vendorServiceCategories = await vendorServiceCategoryRepository.getVendorServiceCategoriesByVendorId(vendor_id);
    res.json({ status: "success", message: "Service categories retrieved successfully!!", service_categories: vendorServiceCategories });

};

module.exports.getAllServiceCategories = async (req, res, next) => {
    const allServiceCategories = await vendorServiceCategoryRepository.getAllVendorsServiceCategories();
    res.json({ status: "success", message: "Service categories retrieved successfully!!", all_services_categories: allServiceCategories });
};