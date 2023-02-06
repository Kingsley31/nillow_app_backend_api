require("dotenv").config();
const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');
const referralCodeGenerator = require("referral-codes");

const vendorServiceCategoryRepository = require("../repositories/vendor_service_category_repository");
const vendorRepository = require("../repositories/vendor_repository");
const vendorValidator = require("../validators/vendor_validator");

module.exports.registerVendor = async (req, res, next) => {
    const errors = await vendorValidator.registerVendorValidator(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid input(s) supplied.',
            errors: errors.array()
        });
    }

    const email = req.body.email ? req.body.email : "";
    //Retrieve and hash password
    let password = req.body.password ? req.body.password : "";
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    const first_name = req.body.first_name ? req.body.first_name : "";
    const last_name = req.body.last_name ? req.body.last_name : "";
    const business_name = req.body.business_name ? req.body.business_name : "";
    const business_type = req.body.business_type ? req.body.business_type : "";
    const service_provider_type = req.body.service_provider_type ? req.body.service_provider_type : "";
    const country_code = req.body.country_code ? req.body.country_code : "";
    const phone_number = req.body.phone_number ? req.body.phone_number : "";
    const emergency_contact_name = req.body.emergency_contact_name ? req.body.emergency_contact_name : "";
    const emergency_contact_country_code = req.body.emergency_contact_country_code ? req.body.emergency_contact_country_code : "";
    const emergency_contact_phone_number = req.body.emergency_contact_phone_number ? req.body.emergency_contact_phone_number : "";
    const referral_code = await referralCodeGenerator.generate({ length: 8, prefix: "vendor-" })[0];
    // const address = req.body.address ? req.body.address : "";

    const vendor = await vendorRepository.storeVendor({ referral_code, country_code, phone_number, email, password, first_name, last_name, business_name, business_type, service_provider_mode: service_provider_type, service_provider_type, emergency_contact_name, emergency_contact_country_code, emergency_contact_phone_number });
    const token = jwt.encode(vendor, process.env.JWT_SECRETE);
    res.json({ status: "success", message: "Registeration successful!!", token, user: vendor });
};



module.exports.loginVendor = async (req, res, next) => {
    const errors = await vendorValidator.loginVendorValidator(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid input(s) supplied.',
            errors: errors.array()
        });
    }

    const email = req.body.email ? req.body.email : "";
    const password = req.body.password ? req.body.password : "";

    let vendor = await vendorRepository.findOneVendor({ email, is_deleted: 0 });
    if (!vendor) {
        return res.status(400).json({ status: "error", message: "Invalid Login credentials." });
    }

    const passwordIsCorrect = await bcrypt.compare(password, vendor.password);

    if (passwordIsCorrect) {
        const token = jwt.encode(vendor, process.env.JWT_SECRETE);
        delete vendor.password;
        return res.json({ status: "success", message: "Login successful", token, user: vendor });
    } else {
        return res.status(400).json({ status: "error", message: "Invalid Login credentials." });
    }
};


module.exports.updateVendor = async (req, res, next) => {
    const errors = await vendorValidator.updateVendorValidator(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid input(s) supplied.',
            errors: errors.array()
        });

    }

    let dataToBeUpdated = req.body;
    delete dataToBeUpdated.phone_number;
    delete dataToBeUpdated.password;
    delete dataToBeUpdated.email;
    delete dataToBeUpdated.country_code;
    delete dataToBeUpdated.service_categories;
    delete dataToBeUpdated.service_provider_type;

    if (dataToBeUpdated.latitude && dataToBeUpdated.longitude) {
        const longitude = parseFloat(dataToBeUpdated.longitude);
        const latitude = parseFloat(dataToBeUpdated.latitude);
        dataToBeUpdated.location = {
            type: 'Point',
            coordinates: [longitude, latitude],
        };
    }

    delete dataToBeUpdated.latitude;
    delete dataToBeUpdated.longitude;

    const id = req.params.vendor_id;
    const updatedVendor = await vendorRepository.findByIdAndupdateVendor(id, dataToBeUpdated);
    delete updatedVendor.password;
    return res.json({ status: "success", message: "Vendor updated successfully", user: updatedVendor });
};

module.exports.getVendorById = async (req, res, next) => {
    const errors = await vendorValidator.getVendorByIdValidator(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid input(s) supplied.',
            errors: errors.array()
        });

    }
    const id = req.params.vendor_id;
    let vendor = await vendorRepository.findVendorById(id);
    delete vendor.password;
    return res.json({ status: "success", message: "Vendor retrieved successfully", user: vendor });
};


module.exports.getAllVendors = async (req, res, next) => {
    let vendors = await vendorRepository.findMultipleVendors({});
    if (req.query.recommended) {
        vendors = await vendorRepository.findMultipleVendors({ rating: { $gt: 3 } });
    }

    if (req.query.special_offers) {
        vendors = await vendorRepository.findMultipleVendors({ rating: { $gt: 4 } });
    }

    if (req.query.search && req.query.search.trim() != "") {
        const search = req.query.search.trim();
        vendors = await vendorRepository.findMultipleVendors({ business_name: { $regex: new RegExp(search, 'i') } });
    }

    if (req.query.category_name && req.query.category_name.trim() != "") {
        const category_name = req.query.category_name.trim();
        const serviceCategoryIds = await vendorServiceCategoryRepository.searchVendorsServiceCategoryAndReturnIds(category_name);;
        vendors = await vendorRepository.findMultipleVendors({ service_categories: { $in: serviceCategoryIds } });

    }

    // if(req.query.service_name)

    return res.json({ status: "success", message: "All Vendors retrieved successfully", vendors });
};




module.exports.updatePassword = async (req, res, next) => {
    const errors = await vendorValidator.updatePasswordValidator(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid input(s) supplied.',
            errors: errors.array()
        });

    }

    const vendor_id = req.params.vendor_id;
    let password = req.body.new_password ? req.body.new_password : "";
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    const dataToBeUpdated = {
        password
    };
    await vendorRepository.findByIdAndupdateVendor(vendor_id, dataToBeUpdated);
    return res.json({ status: "success", message: "Password updated successfully" });
};



