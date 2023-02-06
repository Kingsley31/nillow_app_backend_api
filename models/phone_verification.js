const mongoose = require('mongoose');

const phoneVerificationSchema = new mongoose.Schema({
    phone_number:String,
    country_code:String,
    otp:String,
    is_verified:{type:Number,default:0},
    sent_date:Date,
  },{ timestamps: { createdAt: 'created_at' , updatedAt: 'updated_at'}});

  const PhoneVerification = mongoose.model('PhoneVerification', phoneVerificationSchema);

  module.exports= PhoneVerification;