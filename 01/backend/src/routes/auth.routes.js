const { Router } = require('express')
// const { registerLimiter  } = require('../middlewares/ratelimiter.middleware')
const { verifyAccessToken, verifyRefreshToken, verifyActiveUser, verifyActiveSession } = require('../middlewares/auth.middleware')
const { rejectEmptyRequestBody, validateSchema } = require('../middlewares/validation.middleware')
const { authSchema } = require('../validators/auth.validators')
const { register, login, logout, logoutAll, refreshToken } = require('../controllers/auth.controllers')
const { sendMessage, getChatHistory } = require('../controllers/chat.controllers')

const authRouter = Router()

// authRouter.post('/register', registerLimiter, register)
authRouter.post('/register', rejectEmptyRequestBody, 
    validateSchema(authSchema.register), 
    register)
    
authRouter.post('/login', rejectEmptyRequestBody, 
    validateSchema(authSchema.login), 
    login)

authRouter.post('/logout', verifyAccessToken, logout)
authRouter.post('/logout-all', verifyAccessToken, logoutAll)

authRouter.post('/refresh-token', verifyRefreshToken, verifyActiveSession, refreshToken)

authRouter.post('/chat', verifyAccessToken, sendMessage)
authRouter.get('/chat/history', verifyAccessToken, getChatHistory)

// authRouter.post('/testing',verifyRefreshToken, verifyActiveSession, refreshToken)

module.exports = authRouter



// authRouter.get('/profile', verifyAccessToken, getProfile)                              // read → skip
// authRouter.put('/change-password', verifyAccessToken, verifyActiveUser, changePassword) // write, sensitive → include
// authRouter.put('/update-profile', verifyAccessToken, verifyActiveUser, updateProfile)   // write → include