const mongoose = require('mongoose');
// const { vendorServiceCategorySchema } = require('./vendor_service_category');

const vendorStaffSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    business_type: String,
    phone_number: String,
    country_code: String,
    email: String,
    password: String,
    profile_avatar_url: String,
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
    assigned_services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'VendorService' }],
    is_deleted: { type: Number, default: 0 }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const VendorStaff = mongoose.model('VendorStaff', vendorStaffSchema);

module.exports = VendorStaff;