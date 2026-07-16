const config = require('../configs/env')
const { REFRESH_COOKIE_OPTIONS } = require('../configs/cookie.config.js')
const Session = require('../models/session.model')
const { hashToken } = require('../utils/crypto.utils')
const { verifyTokenBlacklisted } = require('../utils/blacklist.utils')
const { verifyJwtToken } = require('../utils/jwt.utils')
const { verifyUserById } = require('../repositories/user.repository')
const { AppError } = require('../utils/apperror.utils.js')

const verifyAccessToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization
        
        if(!authHeader?.startsWith('Bearer ')){
            // console.error('Access token not found in Authorization header. Received:',authHeader)

            throw new AppError('Invalid or expired token.', 401)
        }

        const accessToken = authHeader.split(' ')[1]

        if (!accessToken) {  
            throw new AppError('Invalid or expired token.', 401)
        }

        const decoded = verifyJwtToken(accessToken, config.JWT_ACCESS_SECRET)

        // console.log(decoded)

        if (!decoded?.jti || !decoded?.sessionId) {
            console.error('Token has no jti or sessionId claim.')

            throw new AppError('Invalid or expired token.', 401)
        }
        
        const isBlacklisted = await verifyTokenBlacklisted(decoded.jti, 'access')
                
        if(isBlacklisted){
            throw new AppError('Invalid or expired token.', 401)
        }

        req.user = {
            id: decoded.id,
            role: decoded.role
        }
        
        req.tokenData = {
            jti: decoded.jti,
            exp: decoded.exp,
            sessionId: decoded.sessionId
        }        
        
        next()

    } catch(err){
        console.error('Access token verification error:',err.message)

        next(err)
    }
}

const verifyRefreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies?.refreshToken
        
        if(!refreshToken){
            throw new AppError('Invalid or expired token.', 401)
        }

        const decoded = verifyJwtToken(refreshToken, config.JWT_REFRESH_SECRET)

        if (!decoded?.jti) {
            console.error('Token has no jti claim.')

            throw new AppError('Invalid or expired token.', 401)
        }
        
        // const isBlacklisted = await verifyTokenBlacklisted(decoded.jti, 'refresh')
                
        // if(isBlacklisted){
        //     throw new AppError('Invalid or expired token.', 401)
        // }
        
        req.user = {
            id: decoded.id,
        }     
        
        req.tokenData = {
            jti: decoded.jti,
            // exp: decoded.exp
        }  
        
        console.log('debugging token:',refreshToken)
        next()

    } catch(err){
        console.error('Refresh token verification error:',err.message)
        
        next(err)
    }
}

const verifyActiveUser = async (req, res, next) => {
    try {
        const user = await verifyUserById(req.user?.id)

        if (!user || user.isActive === false) {
            throw new AppError('Account inactive.', 401)
        }

        next()

    } catch (err) {
        console.error('User active check error:', err.message)
        next(err)
    }
}

const verifyActiveSession = async (req, res, next) => {
    try {
        const userId = req.user?.id
        const userAgent = req.headers['user-agent'] || 'unknown'
        
        const refreshToken = req.cookies?.refreshToken
        
        if(!refreshToken){
            throw new AppError('Invalid or expired token.', 401)
        }  

        const hashedToken = hashToken(refreshToken)

        const [user, validSession] = await Promise.all([
            verifyUserById(userId),
            
            Session.findOne({
                userId,
                userAgent,
                refreshToken: hashedToken,
                // isRevoked: false,
                expiresAt: { $gt: new Date() }
            })
            .select('+refreshToken')
            .lean(),
        ])

        if (!user || user.isActive === false) {
            console.error('User is not found / User is inactive:',userId)
            
            throw new AppError('Invalid or expired session.', 401)
        }

        console.log('\n', validSession)

        if (!validSession) {
            console.error('Invalid or expired session for userId:',userId)
            
            throw new AppError('Invalid or expired session.', 401)
        }
        
        if (validSession.isRevoked) {
            console.warn(`SECURITY BREACH: Token replay detected for User: ${userId} on Device: ${validSession.userAgent}`)
            
            const result = await Session.updateMany({ 
                    userId, 
                    userAgent: validSession.userAgent,    // speciific not db
                    isRevoked: false  
                },{ 
                    $set: { 
                        refreshToken: null,
                        isRevoked: true, 
                        revokedAt: new Date() 
                    } 
                }
            )

            // console.log('\n',result)
            
            res.clearCookie('refreshToken', REFRESH_COOKIE_OPTIONS)
            
            throw new AppError('Invalid or expired session.', 401)
        }
        
        req.user = { 
            ...req.user,        
            role: user.role 
        }
        
        // console.log(req.user)  // check
        
        req.tokenData = {
            ...(req.tokenData || {}),          
            sessionId: validSession._id  
        }

        // console.log(req.tokenData) // check
        
        next()
        
    } catch (err) {
        console.error('Session verification error:', err.message)
        
        next(err)
    }
}

const authorize = (...roles) => {
    return (req, res, next) => {

        if (!req.user?.role || !roles.includes(req.user.role)) {
            return next(new AppError('Access denied. Insufficient permissions.', 403))
        }

        next()
    }
}

module.exports = {
    verifyAccessToken,
    verifyRefreshToken,
    verifyActiveUser,
    verifyActiveSession,
    authorize
}

// const verifyActiveUser = async (req, res, next) => {
//     try {
//         const userId = req.user?.id

//         const user = await User.findById(userId).select('isActive').lean()

//         if (!user || !user.isActive) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'Session invalid or expired.'
//             })
//         }

//         next()

//     } catch (err) {
//         next(err)
//     }
// }

// const verifyActiveSession = async (req, res, next) => {
//     try {
//         const userId = req.user?.id
//         const userAgent = req.headers['user-agent'] || 'unknown'
//         const refreshToken = req.cookies?.refreshToken

//         const hashedToken = hashToken(refreshToken)

//         const [user, session] = await Promise.all([
//             User.findById(userId).select('role isActive').lean(),
            
//             Session.findOne({
//                 userId,
//                 userAgent,
//                 isRevoked: false,
//                 expiresAt: { $gt: new Date() }
//             })
//             .select('+refreshToken')
//             .lean()
//         ])

//         if (!user || !user.isActive) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'User is inactive.'
//             })
//         }

//         if (!session) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'Session invalid or expired.'
//             })
//         }

//         if (session.refreshToken !== hashedToken) {
            
//             await Session.updateMany(
//                 { userId },
//                 { $set: { 
//                     refreshToken: null, 
//                     isRevoked: true, 
//                     revokedAt: new Date() 
//                 } }
//             )

//             res.clearCookie('refreshToken', { 
//                 httpOnly: true, 
//                 secure: false, 
//                 sameSite: 'strict' 
//             })

//             return res.status(401).json({ 
//                 success: false, 
//                 message: 'Re-authentication required.' 
//             })
//         }

//         req.user.role = user.role

//         req.session = session

//         next()

//     } catch (err) {
//         console.log('error:', err.message)
//         next(err)
//     }
// }

// const verifySessionRefreshToken = (req, res, next) => {
   
//     const refreshToken = req.cookies?.refreshToken
//     const sessionRefreshToken = req.session?.refreshToken

//     console.log('raw token:', refreshToken)
//     console.log('hashed session token:', sessionRefreshToken)
//     console.log('rehashed raw:', hashToken(refreshToken))

//     const isTokenValid = compareTokens(refreshToken, sessionRefreshToken)

//     if (!isTokenValid) {
//         return res.status(401).json({
//             success: false,
//             message: 'Session invalid or expired.'
//         })
//     }

//     next()
// }