const constants = require('./constants');

const accountSid = constants.TWILIO_ACCOUNT_SID;
const authToken = constants.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

function sendTwilioMessage(body, to) {
    return client.messages.create({
        body,
        from: '+919336183391',
        to: `+91${to}`
    });
}

module.exports.sendOtpVerify = (otp, phoneNumber) => {
    const messageBody = `${otp} is your OTP for registration`;
    sendTwilioMessage(messageBody, phoneNumber)
        .then(message => console.log(message.sid))
        .catch(error => console.error("Twilio error:", error));
};

module.exports.sendOtpPassword = (password, phoneNumber) => {
    const messageBody = `Your password is ${password}`;
    sendTwilioMessage(messageBody, phoneNumber)
        .then(message => console.log(message.sid))
        .catch(error => console.error("Twilio error:", error));
};
