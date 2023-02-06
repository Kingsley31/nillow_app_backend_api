const mongoose = require('mongoose');

const passwordResetSchema = new mongoose.Schema({
    country_code:String,
    phone_number:String,
    reset_code:String,
    user_id:mongoose.Schema.Types.ObjectId,
    is_verified:{type:Number,default:0},
    sent_date:Date,
  },{ timestamps: { createdAt: 'created_at' , updatedAt: 'updated_at'}});

  const PasswordReset = mongoose.model('PasswordReset', passwordResetSchema);

  module.exports= PasswordReset;