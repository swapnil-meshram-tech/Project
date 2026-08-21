const { generateOtp, hashOtp } = require('../utils/otp.utils')
const { createOtp } = require('../repositories/otp.repository')

const generateAndSendOtp = async (email) => {
    const rawOtp = generateOtp()
    const hashedOtp = hashOtp(rawOtp)
    const otpExpiresAt = Date.now() + 5 * 60 * 1000

    const otpdata = await createOtp(email, hashedOtp, otpExpiresAt)
    console.log(otpdata)

    return rawOtp
}

const verifyOtpofEmail = async (email, otp) => {
    const hashedOtp = hashOtp(otp)

    const checkOtp = await findOtp(email, hashedOtp)
    console.log(checkOtp)
    
    return checkOtp
}

module.exports = {
    generateAndSendOtp,
    verifyOtpofEmail
}