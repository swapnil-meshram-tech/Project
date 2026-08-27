const Chat = require('../models/chat.model')

const createChat = async (userId, message, response) => {
    if (!userId || !message || !response) throw new Error('All fields are required.')

    return Chat.create({ 
        userId, 
        message, 
        response 
    })
}

const findAllChats = async (userId) => {
    if (!userId) throw new Error('userId is required.')

    return Chat.find({ userId })
    .sort({ createdAt: 1 })
    .lean()
}

const findRecentChats = async (userId, N) => {
    if (!userId) throw new Error('userId is required.')

    return Chat.find({ userId })
    .sort({ createdAt: -1 })
    .limit(N)
    .lean()
}

module.exports = {
    createChat, 
    findAllChats,
    findRecentChats,
}

