const Chat = require('../models/chat.model')

const createChat = async (userId, message, response) => {
    if (!userId || !message || !response) throw new Error('All fields are required.')

    return Chat.create({ 
        userId, 
        message, 
        response 
    })
}

const findChatsByUserId = async (userId) => {
    if (!userId) throw new Error('userId is required.')

    return Chat.find({ userId })
    .sort({ createdAt: 1 })
    .lean()
}

module.exports = {
    createChat, 
    findChatsByUserId,
}

