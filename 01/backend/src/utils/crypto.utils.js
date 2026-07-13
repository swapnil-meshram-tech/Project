const crypto = require('crypto')

const hashToken = (token) => {
    if(!token) throw new Error('Token is required.')
    
    return crypto
        .createHash('sha256')
        .update(token)
        .digest('hex')
}

const generateUUID = () => {
    return crypto.randomUUID()
}

const compareTokens = (token, hashedToken) => {
    try {
        if (!token || !hashedToken) return false
        
        const hashed = hashToken(token)
        const storedBuffer = Buffer.from(hashedToken, 'utf8')
        const hashedBuffer = Buffer.from(hashed, 'utf8')

        if (storedBuffer.length !== hashedBuffer.length) return false

        return crypto.timingSafeEqual(storedBuffer, hashedBuffer)
    
    } catch(err) {
        return false
    }
}

module.exports = { 
    hashToken, 
    generateUUID,
    compareTokens,
}