const { Resend }  = require('resend')
const config  = require('../configs/env')
const { AppError } = require('../utils/apperror.utils')


const resend = new Resend(config.RESEND_API_KEY)

const sendOtpToEmail = async(email, otp) => {
    try { 
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Your verification code',
            html: 
                `
                <div style="font-family: -apple-system, sans-serif; background-color: #f3f4f6; padding: 30px; display: flex; justify-content: center;">
                    <div style="background: #ffffff; padding: 30px; border-radius: 16px; width: 100%; max-width: 400px; text-align: center; border: 1px solid #e5e7eb; box-shadow: 0px 10px 25px -5px rgba(0,0,0,0.05), 0px 8px 10px -6px rgba(0,0,0,0.05), inset 0px -4px 0px #e5e7eb;">
                        
                        <h2 style="color: #111827; margin: 0 0 10px 0; font-size: 22px; font-weight: 700;">Verify your email</h2>
                        <p style="color: #4b5563; font-size: 14px; margin: 0 0 20px 0;">Use the following verification code to complete your request.</p>
                        
                        <!-- Tactile 3D Inset Code Block -->
                        <div style="background: #f9fafb; padding: 16px; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: inset 0px 2px 4px rgba(0,0,0,0.06); margin-bottom: 20px;">
                            <h1 style="letter-spacing: 6px; font-family: monospace; font-size: 32px; color: #111827; margin: 0; padding-left: 6px;">${otp}</h1>
                        </div>
                        
                        <p style="color: #9ca3af; font-size: 12px; margin: 0;">⏱️ This code expires in 2 minutes.</p>
                    </div>
                </div>
                `
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