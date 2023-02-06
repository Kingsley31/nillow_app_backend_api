const PhoneVerification = require("../models/phone_verification");


const phoneVerificationExist = async (countryCode,phoneNumber) => {
    const phoneVerification = await PhoneVerification.findOne({phone_number:phoneNumber,country_code:countryCode,is_verified:0});
    if(phoneVerification){
        return true;
    }
    return false;
};


const verificationCodeIsCorrect = async (countryCode,phoneNumber,otp) => {
    const phoneVerification = await PhoneVerification.findOne({
        phone_number:phoneNumber,
        country_code:countryCode,
        otp,
        is_verified:0
    });
    if(phoneVerification){
        return true;
    }
    return false;
};

const storePhoneVerification = async (phoneVerificationData) => {
    const phoneVerification = new PhoneVerification(phoneVerificationData);
    return await phoneVerification.save();
};

const findByIdAndupdatePhoneVerification = async (id,phoneVerificationUpdateData) => {
    const updateResponse = await PhoneVerification.findByIdAndUpdate(id,phoneVerificationUpdateData);
    return await PhoneVerification.findById(id);
};

const findOnePhoneVerification = async (searchData) => {
    return await PhoneVerification.findOne(searchData);
};

module.exports = {
    phoneVerificationExist,
    verificationCodeIsCorrect,
    storePhoneVerification,
    findByIdAndupdatePhoneVerification,
    findOnePhoneVerification
};
