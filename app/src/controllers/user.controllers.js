const User = require('../database/models/user.model')
const { findUserByIdentifier, findUserById, changeEmailById, compareEmailById, changeEmail, changePassword } = require('../database/repositories/user.repository')
const { AppError } = require('../utils/apperror.utils')

// const getProfile = async (req, res, next) =>{
//     try{
//         const identifier = req.body?.username || req.body?.email
        
//         if(!identifier){
//             // console.error('error: identifier is required.')
//             throw new AppError('Username or email is required.', 400)
//         }

//         const user = await findUserByIdentifier(identifier)

//         if(!user){
//             // console.error('error: User does not exists.')
//             throw new AppError('Invalid or expired session.', 401)
//         }

//         return res.status(201).json({
//             success: true,
//             message: 'User profile retrieved successfully.',
//             // user,
//             data: {
//                 username: user.username,
//                 email: user.email,
//             }
//         })

//     } catch(err){
//         next(err)
//     }
// }

const getProfile = async (req, res, next) =>{
    try{
        const userId = req.user?.id
        
        if(!userId){
            // console.error('error: userId is required.')
            throw new AppError('Invalid or expired session.', 400)
        }

        const user = await findUserById(userId)

        if(!user){
            // console.error('error: User does not exists.')
            throw new AppError('Invalid or expired session.', 401)
        }

        return res.status(201).json({
            success: true,
            message: 'User profile retrieved successfully.',
            data: {
                username: user.username,
                email: user.email,
            }
        })

    } catch(err){
        next(err)
    }
}

const updateEmail = async (req, res, next) =>{
    try{
        const userId = req.user?.id
        const latestEmail = req.body?.email
        
        if(!userId){
            // console.error('error: userId is required.')
            throw new AppError('Invalid or expired session.', 400)
        }

        if(!latestEmail){
            // console.error('error: email is required.')
            throw new AppError('Email is required.', 400)
        }
        
        // const comparedEmail = await compareEmailById(userId, latestEmail)
       
        // if(!comparedEmail){
        //     // console.error('error: User does not exists.')
        //     // throw new AppError('Invalid or expired session.', 401)
        //     throw new AppError('Previous email cannot be used for new email updated.', 401)
        // }
        
        // const changedEmail = await changeEmailById(userId, latestEmail)

        // if(!changedEmail){
        //     // console.error('error: User does not exists.')
        //     // throw new AppError('Invalid or expired session.', 401)
        //     throw new AppError("Email could not be update.", 401)
        // }

        const changedEmail = await changeEmail(userId, latestEmail)
        
        if(!changedEmail){
            // console.error('error: Email could not be update.')
            // throw new AppError('Invalid or expired session.', 401)
            throw new AppError("Email could not be update.", 401)
        }

        return res.status(201).json({
            success: true,
            message: 'Email updated successfully.',
            data: {
                // username: user.username,
                email: changedEmail.email,
            }
        })

    } catch(err){
        next(err)
    }
}

const updatePassword = async (req, res, next) =>{
    try{
        const userId = req.user?.id
        const { oldPassword: previousPassword, newPassword: latestPassword, confirmPassword }  = req.body ?? {}

        if(!userId){
            // console.error('error: userId is required.')
            throw new AppError('Invalid or expired session.', 400)
        }

        if(!previousPassword || !latestPassword || !confirmPassword){
            // console.error('error: previousPassword, latestPassword, confirm password are required.')
            throw new AppError('All fields are required.', 400)
        }

        if(previousPassword === latestPassword){
            // console.error('error: previousPassword and latestPassword could not be similar.')
            throw new AppError('New password cannot be the same as the old password.', 400)
        }

        if(latestPassword.length < 8){
            // console.error('error: Password must be at least 8 characters.')      
            throw new AppError('Password must be at least 8 characters.', 400)
        }

        if(latestPassword !== confirmPassword){
            // console.error('error: Passwords do not match.')
            throw new AppError('New password and confirmation password do not match.', 400)
        }
        
        const changedPassword = await changePassword(userId, previousPassword, latestPassword)
        
        if(!changedPassword){
            // console.error('error: Email could not be update.')
            // throw new AppError('Invalid or expired session.', 401)
            throw new AppError("Password could not be update.", 401)
        }

        return res.status(201).json({
            success: true,
            message: 'Password changed successfully.',
            data: {
                // username: user.username,
                // email: user.email,
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
    getProfile,
    updateEmail,
    updatePassword,
}