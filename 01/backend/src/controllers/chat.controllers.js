const { createChat, findAllChats, findRecentChats} = require('../repositories/chat.repository')
const { generateAIResponse } = require('../utils/ai.utils')
const { AppError } = require('../utils/apperror.utils')

const sendMessage = async (req, res, next) => {
    try {
        const userId = req.user?.id
        const message = req.body?.message

        if (!message) {
            throw new AppError('Message is required.', 400)
        }

        const recentChats = await findRecentChats(userId, 10)

        const orderedChats = recentChats.reverse()
        
        const history = orderedChats.flatMap(chat => [
            { role: 'user', content: chat.message },
            { role: 'system', content: chat.response }
        ])

        const messages = [...history, { role: 'user', content: message }]
        
        console.log(messages)
        const aiResponse = await generateAIResponse(messages)

        const newChat = await createChat(userId, message, aiResponse)

        return res.status(200).json({
            success: true,
            message: 'Message processed successfully.',
            data: {
                message: newChat.message,
                response: newChat.response,
                createdAt: newChat.createdAt
            }
        })
    } catch (err) {
        next(err)
    }
}

const getChatHistory = async (req, res, next) => {
    try {
        const userId = req.user?.id

        const history = await findAllChats(userId)

        return res.status(200).json({
            success: true,
            message: 'Chat history retrieved successfully.',
            data: history
        })
    } catch (err) {
        next(err)
    }
}

module.exports = {
    sendMessage, 
    getChatHistory,
}
