const { Router } = require('express')
const { register, login, logout, logoutAll, refreshToken } = require('../controllers/auth.controllers')
const { verifyAccessToken, verifyRefreshToken, verifyActiveUser, verifyActiveSession } = require('../middlewares/auth.middleware')
const { registerLimiter  } = require('../middlewares/ratelimiter.middleware')
// const { testing } = require('../controllers/test.controller')

const authRouter = Router()

// authRouter.post('/register', registerLimiter, register)
authRouter.post('/register', register)
authRouter.post('/login', login)

authRouter.post('/logout', verifyAccessToken, logout)
authRouter.post('/logout-all', verifyAccessToken, logoutAll)

authRouter.post('/refresh-token', verifyRefreshToken, verifyActiveSession, refreshToken)

authRouter.post('/testing',verifyRefreshToken, verifyActiveSession, refreshToken)

module.exports = authRouter



// authRouter.get('/profile', verifyAccessToken, getProfile)                              // read → skip
// authRouter.put('/change-password', verifyAccessToken, verifyActiveUser, changePassword) // write, sensitive → include
// authRouter.put('/update-profile', verifyAccessToken, verifyActiveUser, updateProfile)   // write → include