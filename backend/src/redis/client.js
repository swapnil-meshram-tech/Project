const Redis = require('ioredis')
const config = require('../configs/env')
const { formatError } = require('../utils/formatError.utils')

const MAX_CONNECTION_RETRIES = 10

let redis = null
let isShutdown = false

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
        
        redis.on('ready', () => console.log('[INFO] Redis: Ready to process requests.'))
        
        redis.on('error', (error) => {
            console.error('[ERROR] Redis: Connection error:', formatError(error))
        })

        redis.on('reconnecting', (delay) => console.warn(`\n[WARN] Redis: Attempting reconnection in ${delay} ms.`))
       
        redis.on('end', () => {
            if(isShutdown) {
                console.log('[INFO] Redis: Connection closed gracefully.')
            } else {
                console.error('[ERROR] Redis: Connection permanently closed.')
            }
        })
    }
    return redis
}

const connectRedis = async () => {
    const client = getRedis()
    
    if(client.status === 'ready') return client
    
    isShutdown = false

    try {
        if(client.status === 'wait') {
            await client.connect()
        }
        return client

    } catch(error) {
        console.error('[ERROR] Redis: Initial connection failed:', formatError(error))
        throw error
    }
}

const disconnectRedis = async() => {
    if(!redis) return 

    isShutdown = true

    try {
        if(redis.status === 'connect' || redis.status === 'ready') {
            await redis.quit()
            // console.log('[INFO] Redis: Connection closed gracefully.')

        } else {
            redis.disconnect()
        }
    } catch(error) {
        console.error('[ERROR] Redis: Connection termination failed:', formatError(error))
        try {
            redis.disconnect()
        
        } catch(forceError) {
            console.error('[ERROR] Redis: Force disconnection failed:', formatError(forceError))
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