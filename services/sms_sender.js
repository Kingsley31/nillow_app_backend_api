const AWS = require('aws-sdk');
require("dotenv").config();

module.exports.sendSMS = async (country_code, phone_number, message) => {
    const appName = process.env.APP_NAME;
    //Send SMS to User Phone
    // 'AWS.SNS.SMS.SenderID': {
    //     'DataType': 'String',
    //     'StringValue': appName
    // },
    var params = {
        Message: message,
        PhoneNumber: `${country_code}${phone_number}`,
        MessageAttributes: {
            'AWS.SNS.SMS.SMSType': {
                'DataType': 'String',
                'StringValue': 'Transactional'
            }
        }
    };

    try {
        const publishTextData = await new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();
        console.log(publishTextData.MessageId);
        return publishTextData.MessageId;
    } catch (error) {
        console.log(error);
        return null;
    }
};