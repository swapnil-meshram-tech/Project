const crypto = require('crypto')

const OTP_LENGTH = 6

const generateOtp = () =>{
    const max = 10 ** OTP_LENGTH
    
    return crypto
        .randomInt(0, max)
        .toString()
        .padStart(OTP_LENGTH , '0')
}

const hashOtp = (otp, identifier) =>{
    return crypto
        .createHash('sha256')
        .update(`${String(otp)}-${String(identifier)}`)
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