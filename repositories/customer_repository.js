const Customer = require("../models/customer");


const emailExist = async (email) => {
    const customer = await Customer.findOne({email,is_deleted:0});
    if(customer){
        return true;
    }
    return false;
};

const findCustomerById = async (id) =>{
    let customer = await Customer.findById(id);
    if(customer){
        customer=customer.toObject();
        customer.role = "customer";
        delete customer.__v;
    }
    return customer;
};

const storeCustomer = async (customerData) => {
    const customer = new Customer(customerData);
    let savedCustomer = await customer.save();
    savedCustomer=savedCustomer.toObject();
    savedCustomer.role = "customer";
    delete savedCustomer.password;
    delete savedCustomer.__v;
    return savedCustomer;
};


const findByIdAndupdateCustomer = async (id,customerUpdateData) => {
    const updateResponse = await Customer.findByIdAndUpdate(id,customerUpdateData);
    let customer = await Customer.findById(id);
    if(customer){
        customer=customer.toObject();
        customer.role = "customer";
        delete customer.__v;
    }
    return customer;
};


const findOneCustomer = async (searchData) => {
    let customer = await Customer.findOne(searchData);
    if(customer){
        customer=customer.toObject();
        customer.role = "customer";
        delete customer.__v;
    }
    return customer;
};


const findOne = async (searchData) => {
    let customer = await Customer.findOne(searchData);
    if(customer){
        customer=customer.toObject();
        customer.role = "customer";
        delete customer.__v;
    }
    return customer;
};





module.exports = {
    emailExist,
    findCustomerById,
    storeCustomer,
    findByIdAndupdateCustomer,
    findOneCustomer,
    findOne
};
