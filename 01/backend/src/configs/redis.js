const Redis = require('ioredis')
const config = require('../configs/env')

let redis = null

const getRedis = () => {
    if(!redis) {
        redis = new Redis({
            host: config.REDIS_HOST,
            port: config.REDIS_PORT,
            password: config.REDIS_PASSWORD,
            
            maxRetriesPerRequest: 3,

            retryStrategy(times) {
                return Math.min(Math.pow(2, times - 1) * 50, 2000)
            }
        })

        redis.on('connect', () => console.log('Redis connected.'))
        redis.on('ready', () => console.log('Redis ready.'))
        
        redis.on('error', (err) => console.error('Redis error:', err.message))
        redis.on('reconnecting', (delay) => console.error(`Redis reconnecting in ${delay} ms.`))
        redis.on('end', () => console.error('Redis connection end.'))
    }

    return redis
}

const connectRedis = async() => {
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