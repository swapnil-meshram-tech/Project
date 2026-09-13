const mongoose = require('mongoose')

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            lowercase: true,
            trim: true,
            required: [true, 'Email is required'],
        },
        hashedOtp: {
            type: String,
            required: [true, 'OTP hash is required'],
            // select: false
        },
        attempts: {
            type: Number,
            default: 0,
        },
        otpExpiresAt: {
            type: Date,
            required: true
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        verificationToken: {
            type: String,
            default: null,
            // select: false
        },
    },
    {
        timestamps: true,
        versionKey: false
    }
)

otpSchema.index({ email: 1 })
otpSchema.index({ otpExpiresAt: 1 }, { expireAfterSeconds: 0 })

module.exports = mongoose.model('Otp', otpSchema)