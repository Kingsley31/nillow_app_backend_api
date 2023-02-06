const express = require('express');
const apiRouter = express.Router();
const phoneVerificationRouter = require('./phone_verifications');
const customerRouter = require('./customers');
const vendorRouter = require("./vendors");
const vendorServiceCategoryRouter = require("./vendor_service_categories");
const vendorServiceRouter = require("./vendor_service");
const vendorStaffRouter = require("./vendor_staff");

apiRouter.use('/api/v1/phone-verification', phoneVerificationRouter);
apiRouter.use('/api/v1/customers', customerRouter);
apiRouter.use('/api/v1/vendors', vendorRouter);
apiRouter.use('/api/v1/vendor-service-categories', vendorServiceCategoryRouter);
apiRouter.use('/api/v1/vendor-services', vendorServiceRouter);
apiRouter.use('/api/v1/vendor-staffs', vendorStaffRouter);

module.exports = apiRouter;

