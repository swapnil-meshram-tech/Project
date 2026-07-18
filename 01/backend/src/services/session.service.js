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

const verifySession = async (userId, userAgent, ip, refreshToken) =>{
    if(!userId || !userAgent || !ip || !refreshToken) throw new Error('All fields are required.')

    const hashedToken = hashToken(refreshToken)

    return Session.findOne({
        userId,
        userAgent,
        ip,
        refreshToken: hashedToken,
        expiresAt: { $gt: new Date() }
    })
    // .select('isRevoked')
    .lean()
}

const deleteSession = async (sessionId) => {
    if(!sessionId) throw new Error('sessionId is required.')
        
    return Session.findByIdAndDelete(
        sessionId
    )
}

const revokeAllSessions = async (userId) => {
    if(!userId) throw new Error('userId is required.')

    return Session.updateMany({ 
        userId,  
        isRevoked: false 
        },
        { $set: { 
            refreshToken: null,
            isRevoked: true, 
            revokedAt: new Date() 
          } 
        }
    )
}


// const revokeActiveSession = async (sessionId) => {
//     if(!sessionId) throw new Error('sessionId is required.')
        
//         return Session.findByIdAndUpdate(
//             sessionId,
//             { $set: { 
//                 refreshToken: null,
//                 isRevoked: true,
//                 revokedAt: new Date()
//             } 
//         },
//         { returnDocument: 'after' }
//     )
//     // .select('isRevoked')
//     .lean()
// }


// const updateSession = async (sessionId, userId, userAgent, ip, newRefreshToken) => {
//     if(!sessionId || !userId || !userAgent || !ip || !newRefreshToken) throw new Error('updateSession: All fields required.')

//     const hashedToken = hashToken(newRefreshToken)
//     const expiresAt = getSessionExpiry()

//     return Session.findOneAndUpdate({ 
//         _id: sessionId, 
//         userId, 
//         isRevoked: false 
//         },
//         { $set: { 
//             userAgent, 
//             ip, 
//             refreshToken: hashedToken, 
//             expiresAt 
//             } 
//         },
//         { returnDocument: 'after' }
//     )
//     .lean()

//     // return Session.findByIdAndUpdate(  // ✅ findByIdAndUpdate — have _id, cleaner than findOneAndUpdate
//     //     sessionId,
//     //     { $set: { 
//     //         userAgent,
//     //         ip, 
//     //         refreshToken: hashedToken,
//     //         expiresAt 
//     //     }},
//     //     { new: true }  // ✅ 'new: true' Mongoose option — same as returnDocument: 'after'
//     // )
//     // .lean()
// }


module.exports = { 
    createSession,
    verifySession,
    deleteSession,
    revokeAllSessions,
    // updateSession,
    // revokeActiveSession,
    // revokeAllDeviceSessions
}