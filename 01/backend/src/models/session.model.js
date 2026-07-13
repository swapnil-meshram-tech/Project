// const crypto = require('crypto')
const mongoose = require('mongoose')

const sessionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID relationship is required'],
        },
        ip: {
            type: String,
            required: [true, 'Ip is required.'],
            select: false
        },
        userAgent: {
            type: String,
            required: [true, 'UserAgent is required.'],
        },
        refreshToken: {
            type: String,
            select: false,
            default: null 
        },
        isRevoked: {
            type: Boolean,
            default: false,
        },
        revokedAt: {
            type: Date,
            default: null
        },
        expiresAt: {
            type: Date,
            required: [true, 'Expiration date is required'],
            // index: {
            //     expires: 0
            // }
        }
    },
    { 
        timestamps: true,
        versionKey: false
    }
)

sessionSchema.index({ userId: 1, userAgent: 1, isRevoked: 1 })          // ✅ verifyActiveSession
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }) 
sessionSchema.index(
    { refreshToken: 1 },
    { unique: true, partialFilterExpression: { refreshToken: { $type: 'string' } } }
)

// const Session = mongoose.model('Session', sessionSchema)

module.exports = mongoose.model('Session', sessionSchema)