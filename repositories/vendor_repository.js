const Vendor = require("../models/vendor");


const emailExist = async (email) => {
    const vendor = await Vendor.findOne({ email, is_deleted: 0 });
    if (vendor) {
        return true;
    }
    return false;
};

const findVendorByIdRaw = async (id) => {
    let vendor = await Vendor.findById(id);
    return vendor;
};

const findVendorById = async (id) => {
    let vendor = await Vendor.findById(id);
    if (vendor) {
        vendor = vendor.toObject();
        vendor.role = "vendor";
        delete vendor.__v;
    }
    return vendor;
};

const storeVendor = async (vendorData) => {
    const vendor = new Vendor(vendorData);
    let savedVendor = await vendor.save();
    savedVendor = savedVendor.toObject();
    savedVendor.role = "vendor";
    delete savedVendor.password;
    delete savedVendor.__v;
    return savedVendor;
};


const findByIdAndupdateVendor = async (id, vendorUpdateData) => {
    const updateResponse = await Vendor.findByIdAndUpdate(id, vendorUpdateData);
    let vendor = await Vendor.findById(id);
    if (vendor) {
        vendor = vendor.toObject();
        vendor.role = "vendor";
        delete vendor.__v;
    }
    return vendor;
};


const findOneVendor = async (searchData) => {
    let vendor = await Vendor.findOne(searchData);
    if (vendor) {
        vendor = vendor.toObject();
        vendor.role = "vendor";
        delete vendor.__v;
    }
    return vendor;
};


const findOne = async (searchData) => {
    let vendor = await Vendor.findOne(searchData);
    if (vendor) {
        vendor = vendor.toObject();
        vendor.role = "vendor";
        delete vendor.__v;
    }
    return vendor;
};

const serviceCategoryNameExist = async (vendor_id, service_category_name) => {
    const searchCondition = {
        _id: vendor_id,
        'service_categories': {
            $elemMatch: {
                'category_name': service_category_name
            }
        }
    };

    const vendor = await Vendor.findOne(searchCondition);
    if (vendor) {
        return true;
    }
    return false;

};


const findVendorServiceCategoryById = async (vendor_id, service_category_id) => {
    const vendor = await Vendor.findById(vendor_id);
    const vendorServiceCategory = vendor.service_categories.id(service_category_id);
    return vendorServiceCategory;
};


const addVendorServiceCategory = async (vendor_id, serviceCategoryData) => {
    const vendor = await Vendor.findById(vendor_id);
    vendor.service_categories.push(serviceCategoryData);
    await vendor.save();
    const addedServiceCategory = vendor.service_categories[(vendor.service_categories.length - 1)];
    return addedServiceCategory;
};




const findMultipleVendors = async (searchData) => {
    const vendors = await Vendor.find(searchData, { password: 0 }).populate('services').populate('service_categories');
    return vendors;
};



module.exports = {
    emailExist,
    findVendorById,
    storeVendor,
    findByIdAndupdateVendor,
    findOneVendor,
    findOne,
    serviceCategoryNameExist,
    findVendorServiceCategoryById,
    addVendorServiceCategory,
    findVendorByIdRaw,
    findMultipleVendors
};
