const mongoose = require('mongoose');

// const { vendorServiceSchema } = require('./vendor_service');

const vendorServiceCategorySchema = new mongoose.Schema({
  category_name: String,
  category_description: String,
  category_tags: String,
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  vendor_services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'VendorService' }]
});

const VendorServiceCategory = mongoose.model('VendorServiceCategory', vendorServiceCategorySchema);

module.exports = VendorServiceCategory;