const express = require('express');
const router = express.Router();

const apiAuthMiddleware = require("../middlewares/api-auth-middleware");
const verifyToken = require("../middlewares/api-token-verifier-middleware");

const vendorController = require("../controllers/vendor_controller");


/* POST register vendor. */
router.post('/register', apiAuthMiddleware, vendorController.registerVendor);


/* POST login vendor. */
router.post('/login', apiAuthMiddleware, vendorController.loginVendor);


/* POST update vendor. */
router.put('/:vendor_id', verifyToken, vendorController.updateVendor);

/* GET vendor by ID. */
router.get('/:vendor_id', verifyToken, vendorController.getVendorById);


/* GET all vendors. */
router.get('/', verifyToken, vendorController.getAllVendors);
// router.get('/recommended', verifyToken, vendorController.getRecommendedVendors);
// router.get('/special-offers', verifyToken, vendorController.getSpecialOffersVendors);


/** Update vendor password */
router.put("/update/password/:vendor_id", apiAuthMiddleware, vendorController.updatePassword);

const vendorRepository = require("../repositories/vendor_repository");
const passwordResetRouter = require("./password_resets")(vendorRepository);
router.use("/forgot-password", passwordResetRouter);

module.exports = router;