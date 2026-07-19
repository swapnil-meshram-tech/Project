const Session = require('../models/session.model')
const { hashToken } = require('../utils/crypto.utils')

const getSessionExpiry = () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

const createSession = async (userId, userAgent, ip, refreshToken) =>{
    if(!userId || !userAgent || !ip || !refreshToken) throw new Error('All fields are required.')

    const hashedToken = hashToken(refreshToken)
    const expiresAt = getSessionExpiry()

    return Session.create({ 
        userId,
        userAgent,
        ip,
        refreshToken: hashedToken,
        isRevoked: false,
        expiresAt
    })
}

const verifySession = async (userId, userAgent, refreshToken) =>{
    if(!userId || !userAgent || !refreshToken) throw new Error('All fields are required.')

    const hashedToken = hashToken(refreshToken)

    return Session.findOne({
        userId,
        userAgent,
        refreshToken: hashedToken,
        expiresAt: { $gt: new Date() }
    })
    .select('isRevoked userAgent')
    .lean()
}

const deleteSession = async (sessionId) => {
    if(!sessionId) throw new Error('sessionId is required.')
        
    return Session.findByIdAndDelete(
        sessionId
    )
}

const revokeSession = async (sessionId) => {
    if(!sessionId) throw new Error('sessionId is required.')
        
    return Session.findOneAndUpdate(
            { 
                _id: sessionId, 
                isRevoked: false 
            },
            { $set: { 
                isRevoked: true,
                revokedAt: new Date()
            } 
        },
        { returnDocument: 'after' }
        // { new: true }
    )
    // .select('isRevoked')
    .lean()
}

const revokeAllSessions = async (userId) => {
    if(!userId) throw new Error('userId is required.')

    return Session.updateMany({ 
        userId,  
        isRevoked: false 
        },
        { $set: { 
            // refreshToken: null,
            isRevoked: true, 
            revokedAt: new Date() 
          } 
        }
    )
}

module.exports = { 
    createSession,
    verifySession,
    deleteSession,
    revokeSession,
    revokeAllSessions,
}