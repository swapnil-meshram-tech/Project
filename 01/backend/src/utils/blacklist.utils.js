const { getRedis } = require('../configs/redis')

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

        console.log(`verify token is blacklisted: ${jti} and expires in ${expiresIn}s`)

    } catch (err) {
        console.error('Token blacklisting error:', err.message)
    }
}

const verifyTokenBlacklisted = async (jti, type = 'access') => {
    if(!jti || !type) throw new Error('jti and type are required.')

    try { 
        const result = await getRedis().get(`blacklist:${type}:${jti}`)  
        // console.log(`verify token is blacklisted: ${jti}, with result: ${result}`)
        
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