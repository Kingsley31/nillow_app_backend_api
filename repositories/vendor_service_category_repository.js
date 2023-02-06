const VendorServiceCategory = require("../models/vendor_service_category");
const strinCustomFunctions = require("../utils/string_custom_functions");


const findVendorServiceCategoryById = async (id) => {
    let vendorServiceCategory = await VendorServiceCategory.findById(id).populate('vendor');
    if (vendorServiceCategory) {
        vendorServiceCategory = vendorServiceCategory.toObject();
    }
    return vendorServiceCategory;
};

const storeVendorServiceCategory = async (vendorServiceCategoryData) => {
    const vendorServiceCategory = new VendorServiceCategory(vendorServiceCategoryData);
    let savedVendorServiceCategory = await vendorServiceCategory.save();
    savedVendorServiceCategory = savedVendorServiceCategory.toObject();
    return savedVendorServiceCategory;
};


const findByIdAndupdateVendorServiceCategory = async (id, vendorServiceCategoryUpdateData) => {
    const updateResponse = await VendorServiceCategory.findByIdAndUpdate(id, vendorServiceCategoryUpdateData);
    let vendorServiceCategory = await VendorServiceCategory.findById(id).populate('vendor');
    if (vendorServiceCategory) {
        vendorServiceCategory = vendorServiceCategory.toObject();
    }
    return vendorServiceCategory;
};


const findOneVendorServiceCategory = async (searchData) => {
    let vendorServiceCategory = await VendorServiceCategory.findOne(searchData).populate('vendor');
    if (vendorServiceCategory) {
        vendorServiceCategory = vendorServiceCategory.toObject();
    }
    return vendorServiceCategory;
};


const getAllVendorsServiceCategories = async () => {
    const vendorsServiceCategories = await VendorServiceCategory.distinct('category_name', {});
    return vendorsServiceCategories;
};


const searchVendorsServiceCategoryAndReturnIds = async (service_category_name) => {
    const vendorsServiceCategorieIds = await VendorServiceCategory.distinct('_id', { category_name: { $regex: new RegExp(service_category_name, 'i') } });
    return vendorsServiceCategorieIds;
};

const getVendorServiceCategoriesByVendorId = async (vendor_id) => {
    const vendorServiceCategories = await VendorServiceCategory.find({ vendor: vendor_id }).populate('vendor');
    return vendorServiceCategories;
};




const vendorServiceCategoryNameExist = async (vendor_id, vendor_service_category_name) => {
    const searchCondition = {
        vendor: vendor_id,
        category_name: strinCustomFunctions.toTitleCase(vendor_service_category_name)
    };

    const vendorServiceCategory = await VendorServiceCategory.findOne(searchCondition);
    if (vendorServiceCategory) {
        return true;
    }
    return false;
};


const deleteVendorServiceCategory = async (serviceCategoryId) => {
    await VendorServiceCategory.findByIdAndDelete(serviceCategoryId);
};



module.exports = {
    vendorServiceCategoryNameExist,
    storeVendorServiceCategory,
    findVendorServiceCategoryById,
    findByIdAndupdateVendorServiceCategory,
    findOneVendorServiceCategory,
    deleteVendorServiceCategory,
    getAllVendorsServiceCategories,
    getVendorServiceCategoriesByVendorId,
    searchVendorsServiceCategoryAndReturnIds
};


