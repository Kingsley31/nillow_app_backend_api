require("dotenv").config();
const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');

const customerRepository = require("../repositories/customer_repository");
const customerValidator = require("../validators/customer_validator");

module.exports.registerCustomer = async (req, res, next) => {
    const errors = await customerValidator.registerCustomerValidator(req);
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
    const full_name = req.body.full_name ? req.body.full_name : "";
    const country_code = req.body.country_code ? req.body.country_code : "";
    const phone_number = req.body.phone_number ? req.body.phone_number : "";
    const address = req.body.address ? req.body.address : "";
    const emergency_contact_name = req.body.emergency_contact_name ? req.body.emergency_contact_name : "";
    const emergency_contact_country_code = req.body.emergency_contact_country_code ? req.body.emergency_contact_country_code : "";
    const emergency_contact_phone_number = req.body.emergency_contact_phone_number ? req.body.emergency_contact_phone_number : "";

    const customer = await customerRepository.storeCustomer({ country_code, phone_number, email, password, full_name, address, emergency_contact_name, emergency_contact_country_code, emergency_contact_phone_number });
    const token = jwt.encode(customer, process.env.JWT_SECRETE);
    return res.json({ status: "success", message: "Registeration successful!!", token, user: customer });
};

module.exports.loginCustomer = async (req, res, next) => {
    const errors = await customerValidator.loginCustomerValidator(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid input(s) supplied.',
            errors: errors.array()
        });
    }

    const email = req.body.email ? req.body.email : "";
    const password = req.body.password ? req.body.password : "";

    let customer = await customerRepository.findOneCustomer({ email, is_deleted: 0 });
    if (!customer) {
        return res.status(400).json({ status: "error", message: "Invalid Login credentials." });
    }

    const passwordIsCorrect = await bcrypt.compare(password, customer.password);

    if (passwordIsCorrect) {
        const token = jwt.encode(customer, process.env.JWT_SECRETE);
        delete customer.password;
        return res.json({ status: "success", message: "Login successful", token, user: customer });
    } else {
        return res.status(400).json({ status: "error", message: "Invalid Login credentials." });
    }
};

module.exports.updateCustomer = async (req, res, next) => {
    const errors = await customerValidator.updateCustomerValidator(req);
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

    const id = req.params.customer_id;
    const updatedCustomer = await customerRepository.findByIdAndupdateCustomer(id, dataToBeUpdated);
    delete updatedCustomer.password;
    return res.json({ status: "success", message: "Customer updated successfully", user: updatedCustomer });
};

module.exports.updatePassword = async (req, res, next) => {
    const errors = await customerValidator.updatePasswordValidator(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid input(s) supplied.',
            errors: errors.array()
        });
    }

    const customer_id = req.params.customer_id;
    let password = req.body.new_password ? req.body.new_password : "";
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    const dataToBeUpdated = {
        password
    };
    await customerRepository.findByIdAndupdateCustomer(customer_id, dataToBeUpdated);
    return res.json({ status: "success", message: "Password updated successfully" });
};

module.exports.getCustomerById = async (req, res, next) => {
    const errors = await customerValidator.getCustomerByIdValidator(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid input(s) supplied.',
            errors: errors.array()
        });
    }
    const id = req.params.customer_id;
    let customer = await customerRepository.findCustomerById(id);
    delete customer.password;
    return res.json({ status: "success", message: "Customer retrieved successfully", user: customer });
};
