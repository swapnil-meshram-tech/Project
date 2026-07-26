const User = require('../models/user.model')

const findUserByIdentifier = async (identifier) =>{
    if(!identifier) throw new Error('identifier is required.')

    return User.findOne({
        $or: [
            { username: identifier },
            { email: identifier }
        ]
    })
    .select('username email')
    .lean()
}

const findUserById = async (userId) =>{
    if(!userId) throw new Error('userId is required.')

    return User.findById(userId)
    .select('username email')
    .lean()
}

// const compareEmailById = async (userId, latestEmail) =>{
//     if(!userId || !latestEmail) throw new Error('All fields are required.')
    
//     const previous = await findUserById(userId)
    
//     if(previous.email === latestEmail) return false

//     return 'Not Equal'
//     // return previous.email
// }

// const changeEmailById = async (userId, latestEmail) =>{
//     if(!userId || !latestEmail) throw new Error('All fields are required.')

//     return User.findByIdAndUpdate(
//         userId,
//         { $set: {
//             email: latestEmail
//            }
//         },
//         { returnDocument: 'after' }      
//     )
//     .select('username email')
//     .lean()
// }

const changeEmail = async (userId, latestEmail) =>{
    if(!userId || !latestEmail) throw new Error('All fields are required.')
    
    const user = await findUserById(userId)

    if(user.email === latestEmail) return false

    return User.findByIdAndUpdate(
        userId,
        { $set: {
            email: latestEmail
           }
        },
        { returnDocument: 'after' }      
    )
    .select('username email')
    .lean()
}

const changePassword = async (userId, previousPassword, latestPassword) =>{
    if(!userId || !previousPassword || !latestPassword) throw new Error('All fields are required.')
    
    const user = await User.findById(userId).select('+password')
    // console.log(user);
    // console.log(user.password);

    const isPasswordValid = await user.comparePassword(previousPassword)
    console.log(isPasswordValid);
    
    if(!isPasswordValid) return false

    return User.findByIdAndUpdate(
        userId,
        { set: {
            password: latestPassword
           }
        }
    )
    // return User.findByIdAndUpdate(
    //     userId,
    //     { $set: {
    //         email: latestEmail
    //        }
    //     },
    //     { returnDocument: 'after' }      
    // )
    // .select('username email')
    // .lean()
}




module.exports = {
    findUserByIdentifier,
    findUserById,
    // changeEmailById,
    // compareEmailById,
    changeEmail,
    changePassword,
}
