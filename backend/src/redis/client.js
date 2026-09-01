const Redis = require('ioredis')
const config = require('../configs/env')
const { formatError } = require('../utils/formatError.utils')

const MAX_CONNECTION_RETRIES = 10

let redis = null

const getRedis = () => {
    if(!redis || redis.status === 'end') {
        redis = new Redis({
            host: config.REDIS_HOST,
            port: config.REDIS_PORT,
            password: config.REDIS_PASSWORD,
            
            lazyConnect: true,
            maxRetriesPerRequest: 3,
            enableOfflineQueue: false,
            commandTimeout: 5000,
            connectTimeout: 5000,
            enableReadyCheck: true,

            retryStrategy(times) {
                if(times > MAX_CONNECTION_RETRIES) {
                    console.error('[ERROR] Redis: Maximum reconnect attempts reached. Stopping retries.')
                    return null
                }
                
                const delay = Math.min(Math.pow(2, times - 1) * 50, 4000)
                const jitter = Math.floor(Math.random() * 250)

                return delay + jitter
            }
        })

        redis.on('connect', () => console.log('[INFO] Redis: Connection established.'))
        
        redis.on('ready', () => console.log('[INFO] Redis: Ready to process.'))
        
        redis.on('error', (error) => {
            console.error('[ERROR] Redis error:', formatError(error))
        })

        redis.on('reconnecting', (delay) => console.warn(`\n[WARN] Redis: Attempting reconnection in ${delay} ms.`))
       
        redis.on('end', () => {
            console.error(`\n[ERROR] Redis: Connection has been permanently closed.`)
        })
    }
    return redis
}

const connectRedis = async () => {
    const client = getRedis()
    
    if(client.status === 'ready') return client

    try {
        if(client.status === 'wait') {
            await client.connect()
        }
        return client

    } catch(error) {
        console.error('[ERROR] Redis: Initial startup failed:', formatError(error))
        throw error
    }
}

const disconnectRedis = async() => {
    if(!redis) return 

    try {
        if(redis.status === 'connect' || redis.status === 'ready') {
            await redis.quit()
            console.log('[INFO] Redis: Connection closed gracefully.')
        } else {
            redis.disconnect()
        }
    } catch(error) {
        console.error('[ERROR] Redis: Graceful shutdown failed:', formatError(error))
        try {
            redis.disconnect()
        
        } catch(error) {
            console.error('[ERROR] Redis: Force disconnection failed:', formatError(error))
        }  
    } finally {
        redis = null
    }
}

module.exports = { 
    getRedis, 
    connectRedis,
    disconnectRedis
}