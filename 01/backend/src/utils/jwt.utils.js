const jwt = require('jsonwebtoken')
const config = require('../configs/env')
const { generateUUID } = require('../utils/crypto.utils')
const { AppError } = require('../utils/apperror.utils')

const generateAccessToken = (userId, role, sessionId) =>{
   if(!userId || !role || !sessionId) throw new Error('All fields are required.')

   return jwt.sign({
           id: userId,
           role,
           sessionId,
           jti: generateUUID()
        }, config.JWT_ACCESS_SECRET, {
           expiresIn: '15m'
        }
   )
}

const generateRefreshToken = (userId) =>{
   if(!userId) throw new Error('userId is required.')

   return jwt.sign({
           id: userId,
           jti: generateUUID()
        }, config.JWT_REFRESH_SECRET, {
           expiresIn: '7d'
        }
   )
}

const verifyJwtToken = (token, secret) => {
    if (!token || !secret) throw new Error('All fields are required.')

    try {
        return jwt.verify(token, secret)

    } catch (err) {
        throw new AppError('Invalid or expired token.', 401)
    }
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyJwtToken
}