const VendorService = require("../models/vendor_service");
const strinCustomFunctions = require("../utils/string_custom_functions");


const findVendorServiceById = async (id) => {
    let vendorService = await VendorService.findById(id).populate('vendor').populate('service_category');
    if (vendorService) {
        vendorService = vendorService.toObject();
    }
    return vendorService;
};

const storeVendorService = async (vendorServiceData) => {
    const vendorService = new VendorService(vendorServiceData);
    let savedVendorService = await vendorService.save();
    savedVendorService = savedVendorService.toObject();
    return savedVendorService;
};


const findByIdAndupdateVendorService = async (id, vendorServiceUpdateData) => {
    const updateResponse = await VendorService.findByIdAndUpdate(id, vendorServiceUpdateData);
    let vendorService = await VendorService.findById(id).populate('vendor').populate('service_category');
    if (vendorService) {
        vendorService = vendorService.toObject();
    }
    return vendorService;
};


const findOneVendorService = async (searchData) => {
    let vendorService = await VendorService.findOne(searchData).populate('vendor').populate('service_category');
    if (vendorService) {
        vendorService = vendorService.toObject();
    }
    return vendorService;
};


const getAllVendorsServices = async () => {
    const vendorsServices = await VendorService.distinct('service_name', {});
    return vendorsServices;
};

const getVendorServicesByVendorId = async (vendor_id) => {
    const vendorServices = await VendorService.find({ vendor: vendor_id }).populate('vendor').populate('service_category');
    return vendorServices;
};

const getVendorServicesByServiceCategoryId = async (service_category_id) => {
    const vendorServices = await VendorService.find({ service_category: service_category_id }).populate('vendor').populate('service_category');
    return vendorServices;
};




const vendorServiceNameExist = async (service_category_id, service_name) => {
    const searchCondition = {
        service_category: service_category_id,
        service_name: strinCustomFunctions.toTitleCase(service_name)
    };

    const vendorService = await VendorService.findOne(searchCondition);
    if (vendorService) {
        return true;
    }
    return false;
};


const deleteVendorService = async (service_id) => {
    await VendorService.findByIdAndDelete(service_id);
};



module.exports = {
    vendorServiceNameExist,
    storeVendorService,
    findVendorServiceById,
    findByIdAndupdateVendorService,
    findOneVendorService,
    deleteVendorService,
    getAllVendorsServices,
    getVendorServicesByVendorId,
    getVendorServicesByServiceCategoryId
};


