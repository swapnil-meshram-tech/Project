const { Router } = require('express')
const { getProfile, updateProfile, deleteProfile } = require('../controllers/user.controllers')
const { verifyAccessToken } = require('../middlewares/auth.middleware')

const userRouter = Router()

userRouter.use(verifyAccessToken)

userRouter.get('/profile', getProfile)

// userRouter.put('/profile', updateProfile)

// userRouter.put('/change-password', changePassword)

// userRouter.delete('/profile', deleteProfile)

module.exports = userRouter
