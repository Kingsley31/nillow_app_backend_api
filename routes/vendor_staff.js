const express = require('express');
const router = express.Router();

const apiAuthMiddleware = require("../middlewares/api-auth-middleware");
const verifyToken = require("../middlewares/api-token-verifier-middleware");

const vendorStaffController = require("../controllers/vendor_staff_controller");


/* POST register vendor staff. */
router.post('/register', apiAuthMiddleware, vendorStaffController.registerVendorStaff);


/* POST login vendor staff. */
router.post('/login', apiAuthMiddleware, vendorStaffController.loginVendorStaff);


/* POST update vendor staff. */
router.put('/:vendor_staff_id', verifyToken, vendorStaffController.updateVendorStaff);

/* GET vendor staff by ID. */
router.get('/:vendor_staff_id', verifyToken, vendorStaffController.getVendorStaffById);

/* GET list of vendor staff by vendor ID. */
router.get('/vendor/:vendor_id', verifyToken, vendorStaffController.getVendorStaffsByVendorId);


/** Update vendor staff password */
router.put("/update/password/:vendor_staff_id", apiAuthMiddleware, vendorStaffController.updatePassword);

const vendorStaffRepository = require("../repositories/vendor_staff_repository");
const passwordResetRouter = require("./password_resets")(vendorStaffRepository);
router.use("/forgot-password", passwordResetRouter);

module.exports = router;