const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    phone_number: String,
    country_code: String,
    email: String,
    full_name: String,
    emergency_contact_name: String,
    emergency_contact_country_code: String,
    emergency_contact_phone_number: String,
    address: String,
    password: String,
    profile_avatar_url: String,
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] }
    },
    preffered_gender_service_type: String,
    preffered_service_provider_type: String,
    logged_in_device: {
        device_operating_system: String,
        device_name: String,
        device: String,
    },
    is_deleted: { type: Number, default: 0 }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;