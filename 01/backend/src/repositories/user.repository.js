const User = require('../models/user.model')

const verifyUserExistence = async(username, email) =>{
    if(!username || !email) throw new Error('All fields are required.')

    return User.findOne({
        $or: [  
            { username }, 
            { email } 
        ]
    })
    .select('_id')
    .lean()
}

const createUser = async(username, email, password) =>{
    if(!username || !email || !password) throw new Error('All fields are required.')

    return User.create({
        username,
        email,
        password,
    })
}

const findUserByIdentifier = async(identifier) =>{
    if(!identifier) throw new Error('identifier is required.')

    return User.findOne({
        $or: [
            { username: identifier },
            { email: identifier }
        ]
    })
    .select('+password')
}

const findUserById = async(userId) =>{
    if(!userId) throw new Error('userId is required.')

    return User.findById(userId)
    .select('role isActive')
    .lean()
}

module.exports = {
    verifyUserExistence,
    findUserByIdentifier,
    createUser,
    findUserById,
}
