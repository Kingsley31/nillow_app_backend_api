const mongoose = require('mongoose');

const vendorServiceSchema = new mongoose.Schema({
  service_name: String,
  service_description: String,
  duration_in_minutes: Number,
  cost: Number,
  target: String,
  service_status: String,//public or private
  extra_time_start_point: Number,
  location_preference: String,//on or off
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  service_category: { type: mongoose.Schema.Types.ObjectId, ref: 'VendorServiceCategory', required: true },
  staff_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'VendorStaff' }]
});

const VendorService = mongoose.model('VendorService', vendorServiceSchema);

module.exports = VendorService;