const Redis = require('ioredis')
const config = require('../configs/env')

let redis = null

const getRedis = () => {
    if(!redis) {
        
        redis = new Redis({
            host: config.REDIS_HOST,
            port: config.REDIS_PORT,
            password: config.REDIS_PASSWORD,
            maxRetriesPerRequest: 3
        })

        redis.on('connect', () => console.log('Redis connected.'))
        
        redis.on('error', (err) => {
            console.error('Redis error:', err.message)
            process.exit(1)
        })
    }

    return redis
}

const connectRedis = async () => {
    try {
        await getRedis().ping() 

    } catch(err) {
        console.error('Redis connection error:', err.message)
        process.exit(1)
    }
}

module.exports = { 
    getRedis, 
    connectRedis
}