const User = require('../models/user.model')
const Session = require('../models/session.model')
const { REFRESH_COOKIE_OPTIONS, REFRESH_COOKIE_MAX_AGE } = require('../configs/cookie.config.js')
const { verifyUserExistence, verifyUserCredentials, createUser } = require('../repositories/user.repository')
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt.utils')
const { createSession, revokeActiveSession, revokeAllSession } = require('../services/session.service')
const { tokenBlacklisting } = require('../utils/blacklist.utils')

const register = async (req, res, next) =>{
    try{
        const { username, email, password, confirmPassword } = req.body

        if(!username || !email || !password || !confirmPassword){
            console.error('Registeration error: All fields are required.')
            
            throw new AppError('All fields are required.', 400)
        }

        if(password.length < 8){
            console.error('Registeration error: Password must be at least 8 characters.')
            
            throw new AppError('Password must be at least 8 characters.', 400)
        }

        if(password !== confirmPassword){
            console.error('Registeration error: Passwords do not match.')

            throw new AppError('Passwords do not match.', 400)
        }

        const isUserExists = await verifyUserExistence(username, email)

        if(isUserExists){
            console.error('Registeration error: User already exists.')

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
                role: user.role
            },
            accessToken,
            refreshToken,
            newSession
        })

    } catch(err){
        next(err)
    }
}

const login = async (req, res, next) =>{
    try{
        const { identifier, password } = req.body

        if(!identifier || !password){
            console.error('Login error: All fields are required.')

            throw new AppError('All fields are required.', 400)
        }

        const user = await verifyUserCredentials(identifier)

        if (!user || user.isActive === false) {
            console.error(`Login error: User is not present / active`)

            throw new AppError('Invalid credentials.', 401)
        }

        const isPasswordValid = await user.comparePassword(password)

        if(!isPasswordValid){
            console.error(`Login error: Password is invalid.`)

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
                role: user.role
            },
            accessToken,
            refreshToken,
            newSession
        })

    } catch(err){
        next(err)
    }
}

const logout = async (req, res, next) => {
    try {
        const { jti, exp, sessionId } = req.tokenData
        
        if (!jti || !exp || !sessionId) {
            console.error('Logout error: Received incomplete data:', { jti, exp, sessionId })
            
            throw new AppError('Invalid or expired session.', 401)
        }

        const result = await Promise.all([
            tokenBlacklisting(jti, exp, 'access'),
            revokeActiveSession(sessionId),
        ])
        console.log(result) 

        res.clearCookie('refreshToken', REFRESH_COOKIE_OPTIONS)

        return res.status(200).json({
            success: true,
            message: 'Logged out successfully.',
            result
        })
        
    } catch(err){
        next(err)
    }
}

const refreshToken = async (req, res, next) => {
    try {
        const userId = req.user?.id
        const role = req.user?.role
        const sessionId = req.tokenData.sessionId
        
        console.log('debugging:',sessionId)
        
        const newRefreshToken = generateRefreshToken(userId)
        
        const ip = req.ip || req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket?.remoteAddress
        const userAgent = req.headers['user-agent'] || 'unknown'
        
        const [, newSession] = await Promise.all([
            revokeActiveSession(sessionId),                          
            createSession(userId, userAgent, ip, newRefreshToken),  
        ])
        
        if(!newSession){
            console.error('Token rotation error: Unable to update refresh token in session.')
            
            throw new AppError('Invalid or expired session.', 409)
        }
        
        const newAccessToken = generateAccessToken(userId, role, newSession._id)
       
        console.log('debugging:',newSession)
        
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
    // profile,
    logout,
    // logoutAll,
    refreshToken
}


// const logoutAll = async (req, res, next) => {
    //     try {
        //         const userId = req.user.id
        
        //         const isRevoked = await revokeAllSession(userId)
        
        //         if (!isRevoked) {
//             return res.status(409).json({
    //                 success: false,
    //                 message: 'Already logged out.'
    //             })
    //         }
    
//         res.clearCookie('refreshToken', {
    //             httpOnly: true,
    //             secure: false,
    //             sameSite: 'strict'
    //         })
    
    //         return res.status(200).json({
//             success: true,
//             message: 'Logged out of all devices.'
//         })

//     } catch(err){
    //         next(err)
    //     }
    // }
    
    
