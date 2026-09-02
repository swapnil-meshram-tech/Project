const Redis = require('ioredis')
const config = require('../configs/env')
const { formatError } = require('../utils/formatError.utils')

const MAX_CONNECTION_RETRIES = 10

let redisClient = null
let isShutdown = false

const createRedisClient = () => {
    const redisClient = new Redis({
        host: config.REDIS_HOST,
        port: config.REDIS_PORT,
        password: config.REDIS_PASSWORD,
            
        lazyConnect: true,
        commandTimeout: 5000,
        connectTimeout: 5000,
        enableReadyCheck: true,
            
            // maxRetriesPerRequest: 3,
            // enableOfflineQueue: false,

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

    redisClient.on('connect', () => console.log('[INFO] Redis: Connection established.'))
        
    redisClient.on('ready', () => console.log('[INFO] Redis: Ready to process requests.'))
        
    redisClient.on('reconnecting', (delay) => console.warn(`\n[WARN] Redis: Attempting reconnection in ${delay} ms.`))
        
    redisClient.on('error', (error) => {
        console.error('[ERROR] Redis: Connection error:', formatError(error))
    })
       
    redisClient.on('end', () => {
        console.log("ending");
            
        if(isShutdown) {
            console.log('[INFO] Redis: Connection closed gracefully.')
        } else {
            console.error('[ERROR] Redis: Connection ended.')
        }
    })

    return redisClient
}

const getRedisClient = () => {
    if(!redisClient){
        redisClient = createRedisClient()
    }

    return redisClient
}   

const connectRedis = async () => {
    const redisClient = getRedisClient()
    
    if(redisClient.status === 'ready') return redisClient
    
    isShutdown = false

    try {
        if(redisClient.status === 'wait') {
            await redisClient.connect()
        }

        if(redisClient.status !== 'ready') {
            throw new Error(`Redis: Not ready. Current status: ${redisClient.status}`) 
        }

        return redisClient

    } catch(error) {
        console.error('[ERROR] Redis: Initial connection failed:', formatError(error))
        throw error
    }
}

const disconnectRedis = async() => {
    if(!redisClient) return 
    
    isShutdown = true

    try {
        if(redisClient.status === 'connect' || redisClient.status === 'ready') {
            await redisClient.quit()
            console.log('2 [INFO] Redis: Connection closed gracefully.')
            
        } else {
            console.log('3 [INFO] Redis: Connection closed gracefully.')
            redisClient.disconnect()
            console.log('4 [INFO] Redis: Connection closed gracefully.')
        }
    } catch(error) {
        console.error('[ERROR] Redis: Connection termination failed:', formatError(error))
        try {
            redisClient.disconnect()
        
        } catch(forceError) {
            console.error('[ERROR] Redis: Force disconnection failed:', formatError(forceError))
        }  
    } finally {
        redisClient = null
    }
}

module.exports = { 
    getRedisClient, 
    connectRedis,
    disconnectRedis
}
