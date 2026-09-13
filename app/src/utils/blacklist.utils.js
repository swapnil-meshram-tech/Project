const { getRedis } = require('../redis/client')
const { AppError } = require('./apperror.utils')

const tokenBlacklisting = async (jti, exp, type) => {
    if (!jti || !exp || !type) throw new Error('All fields are required.')
    
    try {
        console.log('exp',exp)
        const expiresIn = (type === 'access') ? exp - Math.floor(Date.now() / 1000) : exp
        console.log('expiresIn',expiresIn)

        await getRedis().set(
            `blacklist:${type}:${jti}`,  
            'revoked',
            'EX',
            expiresIn
        )
        // console.log(`Token: ${jti} is blacklisted and expires in ${expiresIn}s`)
        
        return 'blacklisted'

    } catch (err) {
        console.error('Token blacklisting error:', err.message)
        throw err
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