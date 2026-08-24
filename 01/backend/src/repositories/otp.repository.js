const Otp = require('../models/otp.model')

const storeOtp = async (email, hashedOtp, otpExpiresAt) => {
    return Otp.findOneAndUpdate(
        { email },
        { 
            hashedOtp,
            otpExpiresAt,
            attempts: 0,
            isVerified: false,
            verificationToken: null
        },
        {
            upsert: true,
            returnDocument: 'after',
            setDefaultsOnInsert: true,
            runValidators: true
        }
    ).exec()
}

const findOtp = async (email, hashedOtp) => {
    return Otp.findOne(
        { 
            email,
            otp: hashedOtp
        })
}

module.exports = {
    storeOtp,
    findOtp 
}