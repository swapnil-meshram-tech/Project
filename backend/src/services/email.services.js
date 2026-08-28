const { Resend }  = require('resend')
const config  = require('../configs/env')
const { otpEmailTemplate }  = require('../utils/emailTemplate.utils')
const { AppError } = require('../utils/apperror.utils')


const resend = new Resend(config.RESEND_API_KEY)

const sendOtpToEmail = async(email, otp) => {
    try { 
        const { data, error } = await resend.emails.send({
            from: config.RESEND_EMAIL_FROM,
            to: email,
            subject: 'Your verification code',
            html: otpEmailTemplate(otp) 
        })

        console.log(data);
        console.log(error);
        
        if(error) {
            throw new AppError('Failed to send verification code. Try again later.', 502)
        }

        return data.id

    } catch(error) {
        return 
    }
}

module.exports = {
    sendOtpToEmail
}