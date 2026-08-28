const rateLimit = require('express-rate-limit')
const { ipKeyGenerator } = require('express-rate-limit')

const createLimiter = (config) =>{ 
    const {
        windowMs = 15 * 60 * 1000, // Default 15 mins
        max = 100,                 // Default 100 requests
        message = 'Too many requests. Please try again later.',
        skipAdmin = false,
        skipSuccessfulRequests = false
    } = config

    return rateLimit({
        windowMs,
        max,
        standardHeaders: true,
        legacyHeaders: false,
        skipSuccessfulRequests,

        keyGenerator: (req) => req.user?.id ? `user_${req.user.id}` : (ipKeyGenerator(req.ip) || req.headers['x-forwarded-for'] || 'unknown_ip'),

        skip: (req) => {
            if (req.originalUrl && req.originalUrl?.includes('/health')) 
                return true

            if (skipAdmin && req.user?.role === 'admin') 
                return true

            return false
        },

         handler: (req, res, _next, info) => {
            return res.status(429).json({
                success: false,
                message,
                retryAfterSeconds: Math.ceil(info.windowMs / 1000)
            })
        }
    })
}

const apiLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests. Please try again later.'
})

const authLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many attempts. Try again later.',
    skipSuccessfulRequests: true // Protects against auth brute-force
})

const registerLimiter = createLimiter({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: 'Too many attempts. Try again later.'
})

const passwordResetLimiter = createLimiter({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: 'Too many attempts. Try again later.'
})

const emailLimiter = createLimiter({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: 'Too many attempts. Try again later.'
})


const searchLimiter = createLimiter({
    windowMs: 60 * 1000,
    max: 30,
    message: 'Too many attempts. Try again later.',
    skipAdmin: true // Admins are not penalized for digging data
})


// const apiLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000,  // 15 minute window
//     max: 100,                   // 100 requests per window
//     standardHeaders: true,   // sends RateLimit-* headers
//     legacyHeaders: false,     // disables old X-RateLimit-* headers
//     message: {
//         success: false,
//         message: 'Too many requests, please try again later.',
//         retryAfter: '15 minutes'
//     },
// })

// const authLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 5,                   // Strict: Only 5 failed attempts allowed
//     standardHeaders: true,
//     legacyHeaders: false,
//     skipSuccessfulRequests: true, // Only punish them if they fail the request
//     message: { error: 'Too many  failures. Locked out for 15 minutes.' }
// })

// const loginLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 5,
//     standardHeaders: true,
//     legacyHeaders: false,
//     // skipSuccessfulRequests: true,
//     message: {
//         success:false,
//         message:'Too many login attempts. Try again later.'
//     }
// })

// const registerLimiter = rateLimit({
//     windowMs: 60 * 60 * 1000,
//     max: 5,
//     standardHeaders:true,
//     legacyHeaders:false,
//     message:{
//         success:false,
//         message:'Too many registrations.'
//     }
// })


module.exports = {
    apiLimiter,
    authLimiter,
    registerLimiter,
    passwordResetLimiter,
    emailLimiter,
    searchLimiter
}