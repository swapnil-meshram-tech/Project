const User = require('../models/user.model')

const verifyUserExistence = async(username, email) =>{
    if(!username || !email) throw new Error('Username and email are required.')

    return User.findOne({
        $or: [  
            { username }, 
            { email } 
        ]
    })
    .select('_id')
    .lean()
}

const verifyUserCredentials = async(identifier) =>{
    if(!identifier) throw new Error('verifyUserCredentials: identifier is required.')

    return User.findOne({
        $or: [
            { username: identifier },
            { email: identifier }
        ]
    })
    .select('+password')
}

const createUser = async(username, email, password) =>{
    if(!username || !email || !password) throw new Error('All fields are required.')

    return User.create({
        username,
        email,
        password,
    })
}

const verifyUserById = async(userId) =>{
    if(!userId) throw new Error('verifyUserById: userId is required.')

    return User.findById(userId)
    .select('role isActive')
    .lean()
}


module.exports = {
    verifyUserExistence,
    verifyUserCredentials,
    createUser,
    verifyUserById,
}
