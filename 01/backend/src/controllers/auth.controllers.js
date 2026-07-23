const { REFRESH_COOKIE_OPTIONS, REFRESH_COOKIE_MAX_AGE } = require('../configs/cookie.config.js')
const { verifyUserExistence, findUserByIdentifier, createUser } = require('../repositories/user.repository')
const { createSession, findActiveSessionIds, deleteSession, deleteAllSessions, revokeSession, revokeAllSessions } = require('../repositories/session.repository.js')
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt.utils')
const { tokenBlacklisting } = require('../utils/blacklist.utils')
const { AppError } = require('../utils/apperror.utils.js')

const register = async (req, res, next) =>{
    try{
        const { username, email, password, confirmPassword } = req.body

        if(!username || !email || !password || !confirmPassword){
            // console.error('Registeration error: All fields are required.')
            
            throw new AppError('All fields are required.', 400)
        }

        if(password.length < 8){
            // console.error('Registeration error: Password must be at least 8 characters.')
            
            throw new AppError('Password must be at least 8 characters.', 400)
        }

        if(password !== confirmPassword){
            // console.error('Registeration error: Passwords do not match.')

            throw new AppError('Passwords do not match.', 400)
        }

        const isUserExists = await verifyUserExistence(username, email)

        if(isUserExists){
            // console.error('Registeration error: User already exists.')

            throw new AppError('User already exists.', 409)
        }

        const user = await createUser(username, email, password)

        const refreshToken = generateRefreshToken(user._id)
        
        const ip = req.ip || req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket?.remoteAddress || 'unknown'
        const userAgent = req.headers['user-agent'] || 'unknown'
        
        const newSession = await createSession(user._id, userAgent, ip, refreshToken)
        
        const accessToken = generateAccessToken(user._id, user.role, newSession._id)
        
        res.cookie('refreshToken', refreshToken, {
            ...REFRESH_COOKIE_OPTIONS,
            maxAge: REFRESH_COOKIE_MAX_AGE
        })

        return res.status(201).json({
            success: true,
            message: 'User registered successfully.',
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
                // role: user.role
            },
            accessToken,
            // refreshToken,
            // newSession
        })

    } catch(err){
        next(err)
    }
}

const login = async (req, res, next) =>{
    try{
        const { identifier, password } = req.body

        if(!identifier || !password){
            // console.error('Login error: All fields are required.')

            throw new AppError('All fields are required.', 400)
        }

        const user = await findUserByIdentifier(identifier)

        if (!user) {
             throw new AppError('Invalid credentials.', 401) 
        }

        if (user.isActive === false) {
            throw new AppError('Your account has been deactivated. Please contact support.', 403)
        }

        const isPasswordValid = await user.comparePassword(password)

        if(!isPasswordValid){
            // console.error(`Login error: Password is invalid.`)

            throw new AppError('Invalid credentials.', 401)
        }

        const refreshToken = generateRefreshToken(user._id)
        
        const ip = req.ip || req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket?.remoteAddress
        const userAgent = req.headers['user-agent'] || 'unknown'
        
        const newSession = await createSession(user._id, userAgent, ip, refreshToken)
        
        const accessToken = generateAccessToken(user._id, user.role, newSession._id)
 
        res.cookie('refreshToken', refreshToken, {
            ...REFRESH_COOKIE_OPTIONS,
            maxAge: REFRESH_COOKIE_MAX_AGE
        })

        return res.status(200).json({
            success: true,
            message: 'User logged in successfully.',
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
                // role: user.role
            },
            accessToken,
            // refreshToken,
            // newSession
        })

    } catch(err){
        next(err)
    }
}

const logout = async (req, res, next) => {
    try {
        const { jti, exp, sessionId } = req.tokenData
        
        if (!jti || !exp || !sessionId) {
            // console.error('Logout error: Received incomplete data:', { jti, exp, sessionId }) 
            throw new AppError('Invalid or expired session.', 401)
        }

        const [blacklistResult, sessionResult] = await Promise.all([
            tokenBlacklisting(jti, exp, 'access'),
            revokeSession(sessionId),
            // deleteSession(sessionId),
        ])        

        if (!sessionResult) {            
            throw new AppError('Session not found or already logged out.', 404)
        }

        res.clearCookie('refreshToken', REFRESH_COOKIE_OPTIONS)

        return res.status(200).json({
            success: true,
            message: 'Logged out successfully.',
            // sessionResult
        })
        
    } catch(err){
        next(err)
    }
}

const logoutAll = async (req, res, next) => {
    try {
        const userId = req.user?.id
        const { jti, exp, sessionId } = req.tokenData
        
        if (!userId) {
            // console.error('Logout error.')
            
            throw new AppError('Invalid or expired session.', 401)
        }

        if (!jti || !exp || !sessionId) {
            // console.error('Logout error: Received incomplete data:', { jti, exp, sessionId })
            
            throw new AppError('Invalid or expired session.', 401)
        }

        const blacklistResult = await tokenBlacklisting(jti, exp, 'access')

        const activeSessions = await findActiveSessionIds(userId)
        
        if (!activeSessions || activeSessions.length === 0 ) {            
            throw new AppError('No active sessions found.', 404)
        }

        const sessionResult = await revokeSession(sessionId),

        if (sessionResult.deletedCount === 0 || sessionResult.modifiedCount === 0) {            
            throw new AppError('No active sessions found.', 404)
        }

        res.clearCookie('refreshToken', REFRESH_COOKIE_OPTIONS)

        return res.status(200).json({
            success: true,
            message: 'All session logged out successfully.',
            // sessionResult
        })
        
    } catch(err){
        next(err)
    }
}

const refreshToken = async (req, res, next) => {
    try {
        const userId = req.user?.id
        const role = req.user?.role
        const sessionId = req.tokenData?.sessionId
            
        const ip = req.ip || req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket?.remoteAddress
        const userAgent = req.headers['user-agent'] || 'unknown'
        
        const newRefreshToken = generateRefreshToken(userId)
        
        const [revokedSession, newSession] = await Promise.all([
            revokeSession(sessionId),                          
            createSession(userId, userAgent, ip, newRefreshToken),  
        ])

        if(!revokedSession){            
            throw new AppError('Invalid or expired session.', 409)
        }
        
        if(!newSession){            
            throw new Error('Session creation failed.')
        }
        
        const newAccessToken = generateAccessToken(userId, role, newSession._id)
               
        res.cookie('refreshToken', newRefreshToken, {
            ...REFRESH_COOKIE_OPTIONS,
            maxAge: REFRESH_COOKIE_MAX_AGE
        })
        
        return res.status(200).json({
            success: true,
            message: 'Token rotation successful.',
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            newSession
        })
        
    } catch (err) {
        next(err)
    }
}

module.exports = {
    register,
    login,
    logout,
    logoutAll,
    refreshToken,
    // profile,
}



    
    
