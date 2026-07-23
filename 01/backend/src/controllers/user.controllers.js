const User = require('../models/user.model')
const { findUserByIdentifier, findUserById } = require('../repositories/user.repository')
const { AppError } = require('../utils/apperror.utils')

const getProfile = async (req, res, next) =>{
    try{
        const { identifier } = req.body
        console.log(identifier);
        

        if(!identifier){
            console.error('error: identifier is required.')
            
            throw new AppError('Username or email is required.', 400)
        }

        const user = await findUserByIdentifier(identifier)

        if(!user){
            console.error('error: User not exists.')

            throw new AppError('Invalid.', 401)
        }

        return res.status(201).json({
            success: true,
            message: 'User profile retrieved successfully.',
            // user
            data: {
                username: user.username,
                email: user.email,
            }
        })

    } catch(err){
        next(err)
    }
}

// const UpdateProfile = async (req, res, next) =>{
//     try{
//         const { username, email, password, confirmPassword } = req.body

//         if(!username || !email || !password || !confirmPassword){
//             // console.error('Registeration error: All fields are required.')
            
//             throw new AppError('All fields are required.', 400)
//         }

//         if(password.length < 8){
//             // console.error('Registeration error: Password must be at least 8 characters.')
            
//             throw new AppError('Password must be at least 8 characters.', 400)
//         }

//         if(password !== confirmPassword){
//             // console.error('Registeration error: Passwords do not match.')

//             throw new AppError('Passwords do not match.', 400)
//         }

//         const isUserExists = await verifyUserExistence(username, email)

//         if(isUserExists){
//             // console.error('Registeration error: User already exists.')

//             throw new AppError('User already exists.', 409)
//         }

//         const user = await createUser(username, email, password)

//         const refreshToken = generateRefreshToken(user._id)
        
//         const ip = req.ip || req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket?.remoteAddress || 'unknown'
//         const userAgent = req.headers['user-agent'] || 'unknown'
        
//         const newSession = await createSession(user._id, userAgent, ip, refreshToken)
        
//         const accessToken = generateAccessToken(user._id, user.role, newSession._id)
        
//         res.cookie('refreshToken', refreshToken, {
//             ...REFRESH_COOKIE_OPTIONS,
//             maxAge: REFRESH_COOKIE_MAX_AGE
//         })

//         return res.status(201).json({
//             success: true,
//             message: 'User registered successfully.',
//             data: {
//                 id: user._id,
//                 username: user.username,
//                 email: user.email,
//                 // role: user.role
//             },
//             accessToken,
//             // refreshToken,
//             // newSession
//         })

//     } catch(err){
//         next(err)
//     }
// }

module.exports = {
    getProfile
}