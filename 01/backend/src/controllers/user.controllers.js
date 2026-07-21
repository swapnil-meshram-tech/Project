// const User = require('../models/user.model')

// const getProfile = async (req, res, next) => {
//   try {
//        const id = req.user.id
   
//       //  if(!id){
//       //          return res.status(400).json({
//       //              success: false,
//       //              message: 'Id is required.'
//       //          })
//       //      }
   
//        const user = await User.findById(id).select('-password -refreshToken')
   
//        if (!user) {
//          return res.status(404).json({
//            success: false,
//            message: 'User not found'
//          })
//        }

//        return res.status(200).json({
//          success: true,
//          message: 'Profile retrieved.',
//          data: user
//        })

//     } catch (err) {
//         next(err)
//     }   
// }


// module.exports = {
//     getProfile
// }