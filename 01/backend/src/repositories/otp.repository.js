const Otp = require('../models/otp.model')

const createOtp = async (email, hashedOtp, otpExpiresAt) => {
    return Otp.create({
        email,
        otp: hashedOtp,
        otpExpiresAt
    })
}

const findOtp = async (email, hashedOtp) => {
    return Otp.findOne(
        { 
            email,
            otp: hashedOtp
        })
}

module.exports = {
    createOtp,
    findOtp 
}