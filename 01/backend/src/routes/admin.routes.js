// const { Router } = require('express')
// const { getAllUsers, searchUser, getUserById, updateUserRole, deactivateUser, activateUser } = require('../controllers/admin.controllers')
// const { verifyAccessToken, authorize } = require('../middlewares/auth.middleware')
// // const { searchLimiter } = require('../middlewares/rateLimit.middleware')

// const adminRouter = Router()

// adminRouter.use(verifyAccessToken)
// adminRouter.use(authorize('admin'));

// adminRouter.get('/users', getAllUsers)

// // adminRouter.get('/users/search', searchLimiter, searchUser);

// adminRouter.get('/users/:id', getUserById)
// adminRouter.put('/users/:id/role', updateUserRole)

// adminRouter.put('/users/:id/deactivate', deactivateUser)
// adminRouter.put('/users/:id/activate', activateUser)

// module.exports = adminRouter