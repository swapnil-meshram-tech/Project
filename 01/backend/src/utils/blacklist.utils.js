const { getRedis } = require('../configs/redis')
const { AppError } = require('../utils/apperror.utils')

const tokenBlacklisting = async (jti, exp, type) => {
    if (!jti || !exp || !type) throw new Error('All fields are required.')
    
    try {
        const expiresIn = exp - Math.floor(Date.now() / 1000)

        if (expiresIn <= 0) return

        await getRedis().set(
            `blacklist:${type}:${jti}`,  
            'revoked',
            'EX',
            expiresIn
        )

        return 'blacklisted'

        // console.log(`Token: ${jti} is blacklisted and expires in ${expiresIn}s`)

    } catch (err) {
        console.error('Token blacklisting error:', err.message)
    }
}

const verifyTokenBlacklisted = async (jti, type) => {
    if(!jti || !type) throw new Error('All fields are required.')

    try { 
        const result = await getRedis().get(`blacklist:${type}:${jti}`)  
        // console.log(`Verify token: ${jti} is blacklisted, with result: ${result}`)

        return result === 'revoked'

    } catch(err) {
        console.error('Blacklist token verification error:', err.message) 
        
        return false   
    }
} 

module.exports = {
    tokenBlacklisting,
    verifyTokenBlacklisted
} 