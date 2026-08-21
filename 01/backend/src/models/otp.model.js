const mongoose = require('mongoose')

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            lowercase: true,
            trim: true,
            required: [true, 'Email is required'],
        },
        otp: {
            type: String,
            trim: true,
            required: [true, 'OTP is required'],
        },
        attempts: {
            type: Number,
            default: 0,
        },
        otpExpiresAt: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

otpSchema.index({ email: 1 })
otpSchema.index({ otpExpiresAt: 1 }, { expireAfterSeconds: 0 })

module.exports = mongoose.model('Otp', otpSchema)