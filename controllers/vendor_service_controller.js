
const vendorServiceRepository = require("../repositories/vendor_service_repository");
const vendorStaffRepository = require("../repositories/vendor_staff_repository");
const vendorServiceValidator = require("../validators/vendor_service_validator");
const vendorRepository = require("../repositories/vendor_repository");

const assignServiceIdToStaffs = async (service_id, staff_ids) => {
    staff_ids.forEach(async (staff_id) => {
        const vendorStaff = await vendorStaffRepository.findVendorStaffByIdRaw(staff_id);
        if (!vendorStaff.assigned_services.includes(service_id)) {
            vendorStaff.assigned_services.push(service_id);
            await vendorStaff.save();
        }

    });
};


module.exports.addVendorService = async (req, res, next) => {
    const errors = await vendorServiceValidator.addVendorServiceValidator(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid input(s) supplied.',
            errors: errors.array()
        });
    }

    const vendor_id = req.params.vendor_id;
    const dataToStore = req.body;
    dataToStore.vendor = vendor_id;
    dataToStore.service_category = req.body.service_category_id;
    const vendorService = await vendorServiceRepository.storeVendorService(dataToStore);
    const vendor = await vendorRepository.findVendorByIdRaw(vendor_id);
    vendor.services.push(vendorService);
    await vendor.save();
    if (req.body.staff_ids) {
        assignServiceIdToStaffs(vendorService._id, req.body.staff_ids);
    }

    return res.json({ status: "success", message: "Vendor Service Added Successfully", vendor_service: vendorService });
};


module.exports.updateVendorService = async (req, res, next) => {
    const errors = await vendorServiceValidator.updateVendorServiceValidator(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid input(s) supplied.',
            errors: errors.array()
        });
    }

    const dataToBeUpdated = req.body;
    req.body.service_category_id ? dataToBeUpdated.service_category = req.body.service_category_id : null;
    const service_id = req.params.service_id;
    const vendorService = await vendorServiceRepository.findByIdAndupdateVendorService(service_id, dataToBeUpdated);
    if (req.body.staff_ids) {
        assignServiceIdToStaffs(vendorService._id, req.body.staff_ids);
    }
    return res.json({ status: "success", message: "Vendor Service Updated Successfully", vendor_service: vendorService });
};

module.exports.deleteVendorService = async (req, res, next) => {
    const errors = await vendorServiceValidator.deleteVendorServiceValidator(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid input(s) supplied.',
            errors: errors.array()
        });
    }
    const service_id = req.params.service_id;
    await vendorServiceRepository.deleteVendorService(service_id);
    return res.json({ status: "success", message: "Vendor Service Deleted Successfully" });
};


module.exports.getVendorServices = async (req, res, next) => {
    const vendor_id = req.params.vendor_id;
    const vendorServices = await vendorServiceRepository.getVendorServicesByVendorId(vendor_id);
    return res.json({ status: "success", message: "Vendor Services Retrieved Successfully", vendor_services: vendorServices });
};

module.exports.getVendorServiceCategoryServices = async (req, res, next) => {
    const service_category_id = req.params.service_category_id;
    const vendorServices = await vendorServiceRepository.getVendorServicesByServiceCategoryId(service_category_id);
    return res.json({ status: "success", message: "Vendor Service Category Services Retrieved Successfully", vendor_service_category_services: vendorServices });
};

module.exports.getAllServices = async (req, res, next) => {
    const vendorServices = await vendorServiceRepository.getAllVendorsServices();
    return res.json({ status: "success", message: "Services Retrieved Successfully", all_services: vendorServices });
};