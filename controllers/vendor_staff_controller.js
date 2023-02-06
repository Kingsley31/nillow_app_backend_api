require("dotenv").config();
const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');

const vendorStaffRepository = require("../repositories/vendor_staff_repository");
const vendorRepository = require("../repositories/vendor_repository");
const vendorStaffValidator = require("../validators/vendor_staff_validator");

module.exports.registerVendorStaff = async (req, res, next) => {
    const errors = await vendorStaffValidator.registerVendorStaffValidator(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid input(s) supplied.',
            errors: errors.array()
        });
    }

    let staffData = req.body;
    if (staffData.password) {
        const salt = await bcrypt.genSalt(10);
        staffData.password = await bcrypt.hash(staffData.password, salt);
    }

    if (staffData.assigned_services_ids) {
        staffData.assigned_services = staffData.assigned_services_ids;
        delete staffData.assigned_services_ids;
    }
    const vendor = await vendorRepository.findOneVendor({ referral_code: staffData.vendor_referral_code });
    staffData.vendor = vendor._id;
    const vendorStaff = await vendorStaffRepository.storeVendorStaff(staffData);
    const token = jwt.encode(vendorStaff, process.env.JWT_SECRETE);
    res.json({ status: "success", message: "Registeration successful!!", token, user: vendorStaff });

};

module.exports.loginVendorStaff = async (req, res, next) => {
    const errors = await vendorStaffValidator.loginVendorStaffValidator(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid input(s) supplied.',
            errors: errors.array()
        });
    }

    const email = req.body.email ? req.body.email : "";
    const password = req.body.password ? req.body.password : "";

    let vendorStaff = await vendorStaffRepository.findOneVendorStaff({ email, is_deleted: 0 });
    if (!vendorStaff) {
        return res.status(400).json({ status: "error", message: "Invalid Login credentials." });
    }

    const passwordIsCorrect = await bcrypt.compare(password, vendorStaff.password);

    if (passwordIsCorrect) {
        const token = jwt.encode(vendorStaff, process.env.JWT_SECRETE);
        delete vendorStaff.password;
        return res.json({ status: "success", message: "Login successful", token, user: vendorStaff });
    } else {
        return res.status(400).json({ status: "error", message: "Invalid Login credentials." });
    }
};


module.exports.updateVendorStaff = async (req, res, next) => {
    const errors = await vendorStaffValidator.updateVendorStaffValidator(req);
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

    if (dataToBeUpdated.assigned_services_ids) {
        dataToBeUpdated.assigned_services = dataToBeUpdated.assigned_services_ids;
        delete dataToBeUpdated.assigned_services_ids;
    }

    const id = req.params.vendor_staff_id;
    const updatedVendorStaff = await vendorStaffRepository.findByIdAndupdateVendorStaff(id, dataToBeUpdated);
    delete updatedVendorStaff.password;
    return res.json({ status: "success", message: "Staff updated successfully", user: updatedVendorStaff });
};


module.exports.getVendorStaffById = async (req, res, next) => {
    const errors = await vendorStaffValidator.getVendorStaffByIdValidator(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid input(s) supplied.',
            errors: errors.array()
        });

    }

    const id = req.params.vendor_staff_id;
    let vendorStaff = await vendorStaffRepository.findVendorStaffById(id);
    delete vendorStaff.password;
    return res.json({ status: "success", message: "Staff retrieved successfully", user: vendorStaff });
};

module.exports.getVendorStaffsByVendorId = async (req, res, next) => {
    const errors = await vendorStaffValidator.getVendorStaffsByVendorIdValidator(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid input(s) supplied.',
            errors: errors.array()
        });

    }

    const id = req.params.vendor_id;
    const vendorStaffs = await vendorStaffRepository.findAllVendoStaffByVendorId(id);
    return res.json({ status: "success", message: "Staff retrieved successfully", vendor_staffs: vendorStaffs });
};


module.exports.updatePassword = async (req, res, next) => {
    const errors = await vendorStaffValidator.updatePasswordValidator(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid input(s) supplied.',
            errors: errors.array()
        });

    }

    const vendor_staff_id = req.params.vendor_staff_id;
    let password = req.body.new_password ? req.body.new_password : "";
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    const dataToBeUpdated = {
        password
    };
    await vendorStaffRepository.findByIdAndupdateVendorStaff(vendor_staff_id, dataToBeUpdated);
    return res.json({ status: "success", message: "Password updated successfully" });
};