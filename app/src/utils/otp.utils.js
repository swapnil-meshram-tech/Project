const crypto = require('crypto')
const config = require('../configs/env')


const OTP_LENGTH = 6
const OTP_MAX_VALUE = 10 ** OTP_LENGTH

const generateOtp = () => {
    return crypto
        .randomInt(0, OTP_MAX_VALUE)
        .toString()
        .padStart(OTP_LENGTH , '0')
}

const hashOtp = (otp, identifier) => {
    if(!otp || !identifier) {
        throw new Error('All fields are required.')
    }

    const normalizedOtp = String(otp).trim()
    const normalizedIdentifier = String(identifier).toLowerCase().trim()

    return crypto
        .createHmac('sha256', config.OTP_SECRET_KEY)
        .update(`${normalizedOtp}-${normalizedIdentifier}`)
        .digest('hex')
}

const compareOtp = (rawOtp, hashedOtp,identifier) =>{
    try {
        // const hash = 
    } catch(error) {

    }
}

const generateVerificationToken = () =>{ 
    return crypto
        .randomBytes(32)
        .toString('hex')
}

module.exports = {
    generateOtp,
    hashOtp,
    generateVerificationToken
}