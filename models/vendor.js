const mongoose = require('mongoose');
// const { vendorServiceCategorySchema } = require('./vendor_service_category');

const vendorSchema = new mongoose.Schema({
    referral_code: String,
    first_name: String,
    last_name: String,
    street_address: String,
    city: String,
    state_or_province: String,
    postal_code: String,
    country: String,
    rating: { type: Number, default: 0 },
    business_name: String,
    business_type: String,
    phone_number: String,
    country_code: String,
    email: String,
    password: String,
    profile_avatar_url: String,
    emergency_contact_name: String,
    emergency_contact_country_code: String,
    emergency_contact_phone_number: String,
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] }
    },
    service_provider_mode: String,
    service_provider_type: String,
    service_categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'VendorServiceCategory' }],
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'VendorService' }],
    is_deleted: { type: Number, default: 0 }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

vendorSchema.index({ location: '2dsphere' });

const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;