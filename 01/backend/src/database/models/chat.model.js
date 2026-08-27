const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID relationship is required'],
        },
        message: {
            type: String,
            required: true
        },
        response: {
            type: String,
            required: true
        }
    },
    { 
        timestamps: true,
        versionKey: false
    }
)

chatSchema.index({ userId: 1, createdAt: 1 });

module.exports = mongoose.model('Chat', chatSchema)