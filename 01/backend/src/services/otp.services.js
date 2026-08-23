const { generateOtp, hashOtp } = require('../utils/otp.utils')
const { createOtp, findOtp } = require('../repositories/otp.repository')
const { sendOtpToEmail } = require('../services/email.services.js')
const { AppError } = require('../utils/apperror.utils.js')

const OTP_EXPIRY_DURATION = 2 * 60 * 1000

const generateAndSendOtp = async (email) => {
    const rawOtp = generateOtp()
    const hashedOtp = hashOtp(rawOtp)
    const otpExpiresAt = Date.now() + OTP_EXPIRY_DURATION
    console.log('Testing: ', otpExpiresAt);

    const otpdata = await createOtp(email, hashedOtp, otpExpiresAt)
    console.log(otpdata)

    await sendOtpToEmail(email, rawOtp)

    return rawOtp
}

const verifyOtpofEmail = async (email, otp) => {
    const hashedOtp = hashOtp(otp)

    const checkOtp = await findOtp(email, hashedOtp)
    console.log(checkOtp)

    if(!checkOtp){
        throw new AppError('Otp dont match.', 401)
    }

    return checkOtp
}

module.exports = {
    generateAndSendOtp,
    verifyOtpofEmail
}