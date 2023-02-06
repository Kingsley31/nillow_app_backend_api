const VendorStaff = require("../models/vendor_staff");


const findVendorStaffByIdRaw = async (vendor_staff_id) => {
    const vendorStaff = await VendorStaff.findById(vendor_staff_id).populate('vendor');
    return vendorStaff;
};

const findOneVendorStaff = async (searchData) => {
    let vendorStaff = await VendorStaff.findOne(searchData).populate('vendor');
    if (vendorStaff) {
        vendorStaff = vendorStaff.toObject();
        vendorStaff.role = "staff";
        return vendorStaff;
    }
    return null;
};

const storeVendorStaff = async (staffData) => {
    const vendorStaff = new VendorStaff(staffData);
    let savedVendorStaff = await vendorStaff.save();
    savedVendorStaff = savedVendorStaff.toObject();
    savedVendorStaff.role = "staff";
    delete savedVendorStaff.password;
    delete savedVendorStaff.__v;
    return savedVendorStaff;
}

const findByIdAndupdateVendorStaff = async (id, vendorStaffUpdateData) => {
    const updateResponse = await VendorStaff.findByIdAndUpdate(id, vendorStaffUpdateData);
    let vendorStaff = await VendorStaff.findById(id).populate('vendor');
    if (vendorStaff) {
        vendorStaff = vendorStaff.toObject();
        vendorStaff.role = "staff";
        delete vendorStaff.__v;
    }
    return vendorStaff;
};


const findAllVendoStaffByVendorId = async (vendor_id) => {
    const allVendorStaff = await VendorStaff.find({ vendor: vendor_id, is_deleted: 0 }, { password: 0 }).populate('vendor');
    return allVendorStaff;
};

const findVendorStaffById = async (vendor_staff_id) => {
    let vendorStaff = await VendorStaff.findById(vendor_staff_id).populate('vendor');
    if (vendorStaff) {
        vendorStaff = vendorStaff.toObject();
        vendorStaff.role = "staff";
        delete vendorStaff.password;
    }
    return vendorStaff;
};

const findOne = async (searchData) => {
    let vendorStaff = await VendorStaff.findOne(searchData).populate('vendor');
    if (vendorStaff) {
        vendorStaff = vendorStaff.toObject();
        vendorStaff.role = "staff";
        delete vendorStaff.__v;
    }
    return vendorStaff;
};


module.exports = {
    findVendorStaffByIdRaw,
    findOneVendorStaff,
    storeVendorStaff,
    findByIdAndupdateVendorStaff,
    findAllVendoStaffByVendorId,
    findVendorStaffById,
    findOne

};

