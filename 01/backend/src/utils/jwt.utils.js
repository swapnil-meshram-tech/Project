const jwt = require('jsonwebtoken')
const config = require('../configs/env')
const { generateUUID } = require('../utils/crypto.utils')

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

const verifyJwtToken = (token, secret) =>{
   if(!token || !secret) throw new Error('Token and secret are required.')

   return jwt.verify(token, secret)
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyJwtToken
}