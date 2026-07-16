const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
            required: [true, 'Username is required'],
            minLength: [3, 'Username must be at least 3 characters'],
            maxLength: [30, 'Username cannot exceed 30 characters'],
        },
        email: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
            required: [true, 'Email is required'],
            // match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minLength: [8, 'Password must be at least 8 characters'],
            select: false
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        isActive: {
            type: Boolean,
            default: true,
        }
    },
    { 
        timestamps: true,
        versionKey: false
    }
)

userSchema.index({ username: 1, isActive: 1 })
userSchema.index({ email: 1, isActive: 1 })  

userSchema.pre('save', async function() {
    if (!this.isModified('password')) return 
        
    const salt = await bcrypt.genSalt(12)       // Cost factor 12 balances strong security and server speed
    this.password = await bcrypt.hash(this.password, salt)

})

userSchema.methods.comparePassword = async function(password){
    if(!password) return false
    
    return await bcrypt.compare(password, this.password)
}

// const User = mongoose.model('User', userSchema)

module.exports = mongoose.model('User', userSchema)