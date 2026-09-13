const Redis = require('ioredis')
const config = require('../configs/env')
const { formatError } = require('../utils/formatError.utils')

const MAX_CONNECTION_RETRIES = 10

let redisClient = null
let isShutdown = false

const createRedisClient = () => {
    const client = new Redis({
        host: config.REDIS_HOST,
        port: config.REDIS_PORT,
        password: config.REDIS_PASSWORD,
            
        lazyConnect: true,
        commandTimeout: 5000,
        connectTimeout: 5000,
        enableReadyCheck: true,
            
            maxRetriesPerRequest: 3,
            enableOfflineQueue: false,

        retryStrategy(times) {
            if(times > MAX_CONNECTION_RETRIES) {
                console.error('[ERROR] Redis: Maximum reconnect attempts reached. Stopping retries.')
                return null
            }
                
            const delay = Math.min(2 ** (times - 1) * 50, 4000)
            const jitter = Math.floor(Math.random() * 250)

            return delay + jitter
        }
    })

    client.on('connect', () => console.log('[INFO] Redis: Connection established.'))
        
    client.on('ready', () => console.log('[INFO] Redis: Ready to process requests.'))
        
    client.on('reconnecting', (delay) => console.warn(`\n[WARN] Redis: Attempting reconnection in ${delay} ms.`))
        
    client.on('error', (error) => {
        console.error('[ERROR] Redis: Connection error:', formatError(error))
    })
       
    client.on('end', () => {   
        if(!isShutdown) {
            console.error('[ERROR] Redis: Connection ended.')
        }
    })

    return client
}

const getRedisClient = () => {
    if(!redisClient || redisClient.status === 'end'){
        redisClient = createRedisClient()
    }

    return redisClient
}   

const connectRedis = async () => {
    const client = getRedisClient()
    
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

const disconnectRedis = async () => {
    if(!redisClient) return 
    
    isShutdown = true

    try {
        if(redisClient.status === 'connect' || redisClient.status === 'ready') {
            await redisClient.quit()
            console.log('[INFO] Redis: Connection closed gracefully.')
            
        } else {
            redisClient.disconnect()
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
