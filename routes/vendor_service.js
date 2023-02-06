const express = require('express');
const router = express.Router();


const verifyToken = require("../middlewares/api-token-verifier-middleware");

const vendorServiceController = require("../controllers/vendor_service_controller");


/* POST add vendor service . */
router.post('/:vendor_id', verifyToken, vendorServiceController.addVendorService);

/* PUT update vendor service. */
router.put('/:service_id', verifyToken, vendorServiceController.updateVendorService);

/* DELETE delete vendor service. */
router.delete('/:vendor_id/:service_id', verifyToken, vendorServiceController.deleteVendorService);


/* GET get a vendor services. */
router.get('/vendor/:vendor_id', verifyToken, vendorServiceController.getVendorServices);

/* GET get a service category services. */
router.get('/service-category/:service_category_id', verifyToken, vendorServiceController.getVendorServiceCategoryServices);

/* GET get all service. */
router.get('/', verifyToken, vendorServiceController.getAllServices);


module.exports = router;