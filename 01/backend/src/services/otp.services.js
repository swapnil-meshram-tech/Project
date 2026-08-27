const { generateOtp, hashOtp } = require('../utils/otp.utils')
const { storeOtp, findOtp } = require('../database/repositories/otp.repository')
const { sendOtpToEmail } = require('../services/email.services.js')
const { AppError } = require('../utils/apperror.utils.js')

const OTP_EXPIRY_DURATION = 2 * 60 * 1000

const generateAndSendOtp = async(email) => {
    try { 
        const rawOtp = generateOtp()
        const hashedOtp = hashOtp(rawOtp, email)
        const otpExpiresAt = Date.now() + OTP_EXPIRY_DURATION
        
        const otpRecord = await storeOtp(email, hashedOtp, otpExpiresAt)
        
        const emailResult = await sendOtpToEmail(email, rawOtp)
        // console.log('TestinTog 2: ', otpRecord )
        console.log('Testing 2: ',emailResult)
    
        return rawOtp    // no return

    } catch(error) {
        throw error
    }
    
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