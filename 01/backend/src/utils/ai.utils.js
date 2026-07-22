const config = require('../configs/env')
const { OpenAI } = require('openai')

const ai = new OpenAI({
    apiKey: config.AI_API_KEY,
    baseURL: config.AI_BASE_URL
})

const generateAIResponse = async (messages) => {
    if (!messages || messages.length === 0) throw new Error('Message is required.');

    const completion = await ai.chat.completions.create({
        model: config.AI_MODEL,
        messages,
        max_tokens: 500, 
        timeout: 15000 
    })

    return completion.choices[0].message.content
}

module.exports = { 
    generateAIResponse 
}

