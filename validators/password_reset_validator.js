const { body,param } = require('express-validator');
require("dotenv").config();



function passwordResetValidator(model) {
    const PasswordReset = require("../models/password_reset");

    const sendPasswordResetCodeValidator = [
        body("country_code")
        .notEmpty()
        .isString()
        .custom(value =>{
            const regex = /^\+?\d+$/;
            if(!regex.test(value)){
                throw new Error('Invalid country code');
            }
            return true;
        }),
        body("phone_number")
        .notEmpty()
        .isString()
        .custom((value,{req}) => {
            const regex = /^\d{6,25}$/;
            if(!regex.test(value)){
                throw new Error('Invalid phone number');
            }

            const country_code = req.body.country_code;
            const phone_number = value;
            return model.findOne({country_code,phone_number,is_deleted:0}).then(fetchedModel => {
                if (!fetchedModel) {
                  return Promise.reject("User does not exist.");
                }
              });
        })
    ];
    
    
    const verifyPasswordResetCodeValidator = [
        body("country_code")
        .notEmpty()
        .isString()
        .custom(value =>{
            const regex = /^\+?\d+$/;
            if(!regex.test(value)){
                throw new Error('Invalid country code');
            }
            return true;
        }),
        body("phone_number")
        .notEmpty()
        .isString()
        .custom((value,{req}) => {

            const regex = /^\d{6,25}$/;
            if(!regex.test(value)){
                throw new Error('Invalid phone number');
            }
            const country_code = req.body.country_code;
            const phone_number = value;
            return PasswordReset.findOne({country_code,phone_number}).then(userPasswordReset => {
                  if (!userPasswordReset) {
                    return Promise.reject('Invalid phone number.');
                  }
            });
        }),
        body('password_reset_code')
        .notEmpty()
        .custom((value,{req}) => {
            const country_code = req.body.country_code;
            const phone_number = req.body.phone_number;
          return PasswordReset.findOne({country_code,phone_number,reset_code:value}).then(userPasswordReset => {
                if (!userPasswordReset) {
                  return Promise.reject('Invalid code.');
                }
                
                if(userPasswordReset.is_verified ==1){
                    return Promise.reject('Unauthorized User.');
                }
                const currentDate = new Date();
                const sentDate = userPasswordReset.sent_date;
                const hoursSinceResetCodeWasSent = Math.abs(currentDate.getTime() - sentDate.getTime()) / 3600000;
                const resetCodeExpiryTimeInHours = process.env.PASSWORD_RESET_CODE_EXPIRY_TIME_IN_HOURS;

                if(hoursSinceResetCodeWasSent>resetCodeExpiryTimeInHours){
                    return Promise.reject('Code has expired.');
                }
            });
        })
    ];


    return {
        sendPasswordResetCodeValidator,
        verifyPasswordResetCodeValidator
    };
}



module.exports = passwordResetValidator;