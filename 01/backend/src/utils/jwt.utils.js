const jwt = require('jsonwebtoken')
const config = require('../configs/env')
const { generateUUID } = require('../utils/crypto.utils')
const { AppError } = require('../utils/apperror.utils')

const generateAccessToken = (userId, role, sessionId) =>{
   if(!userId) throw new Error('userId and role are required.')

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
   if(!userId) throw new Error('userId is required')

   return jwt.sign({
           id: userId,
           jti: generateUUID()
        }, config.JWT_REFRESH_SECRET, {
           expiresIn: '7d'
        }
   )
}

const verifyJwtToken = (token, secret) => {
    if (!token || !secret) throw new AppError('Token and secret are required.', 400)

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