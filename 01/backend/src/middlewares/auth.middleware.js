const config = require('../configs/env')
const { REFRESH_COOKIE_OPTIONS } = require('../configs/cookie.config.js')
const { findUserById } = require('../repositories/user.repository')
const { verifySession, revokeAllSessions } = require('../repositories/session.repository.js')
const { verifyJwtToken } = require('../utils/jwt.utils')
const { verifyTokenBlacklisted } = require('../utils/blacklist.utils')
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
            // console.error('Access token not found in Authorization header, accessToken)
            
            throw new AppError('Invalid or expired token.', 401)
        }

        const decoded = verifyJwtToken(accessToken, config.JWT_ACCESS_SECRET)

        if (!decoded?.id || !decoded?.role || !decoded?.jti || !decoded?.exp || !decoded?.sessionId) {
            // console.error('Token has no claim.')

            throw new AppError('Invalid or expired token.', 401)
        }
        
        const isTokenBlacklisted = await verifyTokenBlacklisted(decoded.jti, 'access')

        const isSessionBlacklisted = await verifyTokenBlacklisted(decoded.sessionId, 'session')
                
        // if(isTokenBlacklisted || isSessionBlacklisted){
        //     throw new AppError('Invalid or expired token.', 401)
        // }

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
        // console.error('Access token verification error:',err.message)

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

        if (!decoded?.id || !decoded?.jti) {
            // console.error('Token has no jti claim.')

            throw new AppError('Invalid or expired token.', 401)
        }
        
        // const isBlacklisted = await verifyTokenBlacklisted(decoded.jti, 'refresh')
                
        // if(isBlacklisted){
        //     throw new AppError('Invalid or expired token.', 401)
        // }
        
        req.user = {
            id: decoded.id,
        }     
        
        // req.tokenData = {
        //     jti: decoded.jti,
        //     // exp: decoded.exp
        // }  
        
        // console.log('debugging token:',refreshToken)
        next()

    } catch(err){
        // console.error('Refresh token verification error:',err.message)
        
        next(err)
    }
}

const verifyActiveSession = async (req, res, next) => {
    try {
        const userId = req.user?.id
        const userAgent = req.headers['user-agent'] || 'unknown'
        const refreshToken = req.cookies?.refreshToken

        const [user, validSession] = await Promise.all([
            findUserById(userId),
            verifySession(userId, userAgent, refreshToken)
        ])

        if (!user || user.isActive === false) {
            // console.error('User is not found / User is inactive:',userId)
            
            throw new AppError('Invalid or expired session.', 401)
        }

        // console.log('\n', user)
        // console.log('\n', validSession)

        if (!validSession) {
            // console.error('Invalid or expired session for userId:',userId)
            
            throw new AppError('Invalid or expired session.', 401)
        }
        
        if (validSession.isRevoked) {
            console.warn(`SECURITY BREACH: Token replay detected for User: ${userId} on Device: ${validSession.userAgent}`)
            
            const result = await revokeAllSessions(user._id)

            // console.log('\n',result)
            
            res.clearCookie('refreshToken', REFRESH_COOKIE_OPTIONS)
            
            throw new AppError('Please login again.', 401)
        }
        
        req.user = { 
            ...req.user,        
            role: user.role 
        }
        
        // console.log(req.user)  // check
        
        req.tokenData = {
            // ...(req.tokenData || {}),          
            sessionId: validSession._id  
        }

        // console.log(req.tokenData) // check
        
        next()
        
    } catch(err) {
        // console.error('Session verification error:', err.message)
        
        next(err)
    }
}

const verifyActiveUser = async (req, res, next) => {
    try {
        const userId = req.user?.id

        const user = await findUserById(userId)

        if (!user || user.isActive === false) {
            throw new AppError('Account inactive.', 401)
        }

        next()

    } catch (err) {
        console.error('User active check error:', err.message)
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
