const { GoogleGenerativeAI } = require('@google/generative-ai')
const config = require('../configs/env')

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY)

const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

const generateAIResponse = async (message) => {
    if (!message) throw new Error('message is required.')

    const result = await model.generateContent(message)

    return result.response.text()
}

module.exports = { 
    generateAIResponse 
}