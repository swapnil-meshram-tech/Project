const { Resend }  = require('resend')
const config  = require('../configs/env')

const resend = new Resend(config.RESEND_API_KEY)

const sendOtpToEmail = async(email, otp) => {
    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Your verification code',
        html: `
            <div style="font-family: Arial, sans-serif;">
                <h2>Verify your email</h2>
                <p>Your OTP code is:</p>
                <h1 style="letter-spacing: 4px;">${otp}</h1>
                <p>This code expires in 5 minutes.</p>
            </div>
        `
    })
}

module.exports = sendOtpToEmail