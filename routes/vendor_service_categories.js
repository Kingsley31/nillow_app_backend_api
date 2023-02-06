const express = require('express');
const router = express.Router();


const verifyToken = require("../middlewares/api-token-verifier-middleware");

const vendorServiceCategoryController = require("../controllers/vendor_service_category_controller");


/* POST add vendor service category. */
router.post('/:vendor_id', verifyToken, vendorServiceCategoryController.addVendorServiceCategory);

/* PUT update vendor service category. */
router.put('/:vendor_id', verifyToken, vendorServiceCategoryController.updateVendorServiceCategory);

/* DELETE delete vendor service category. */
router.delete('/:vendor_id/:service_category_id', verifyToken, vendorServiceCategoryController.deleteVendorServiceCategory);


/* GET get a vendor service categories. */
router.get('/:vendor_id', verifyToken, vendorServiceCategoryController.getVendorServiceCategory);

/* GET get all service categories. */
router.get('/', verifyToken, vendorServiceCategoryController.getAllServiceCategories);


module.exports = router;