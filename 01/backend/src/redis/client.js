const Redis = require('ioredis')
const config = require('../configs/env')

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
                    console.error('[ERROR] Redis failure: Maximum reconnect attempts reached. Stopping retries.')
                    return false
                }
                
                const delay = Math.min(Math.pow(2, times - 1) * 50, 4000)
                const jitter = Math.floor(Math.random() * 250)

                return delay + jitter
            }
        })

        redis.on('connect', () => console.log('[INFO] Redis: TCP socket connection established.'))
        
        redis.on('ready', () => console.log('[INFO] Redis: Client state is ready to process.'))
        
        redis.on('error', (error) => {
            console.error(`[ERROR] Redis runtime exception occured: ${error.message || error}`)
        })

        redis.on('reconnecting', (delay) => console.warn(`\n[WARN] Redis: Attempting reconnection in ${delay} ms.`))
       
        redis.on('end', () => {
            console.error(`\n[ERROR] Redis: Connection pool has been permanently closed.`)
        })
    }
    return redis
}


const connectRedis = async() => {
    const client = getRedis()
    
    if(client.status === 'ready') return client

    try {
        const ready = new Promise((resolve, reject) => {
            function onReady() {
                client.off('ready', onReady)
                client.off('error', onError)
                resolve()
            }

            function onError(error) {
                client.off('ready', onReady)
                client.off('error', onError)
                reject(error)
            }

            client.once('ready', onReady)
            client.once('error', onError)
        })   

        if(client.status === 'wait') {
            client.connect().catch(() => {})
        }

        await ready
        return client

    } catch(error) {
        console.error(`[ERROR] Redis: Initial startup failed: ${error.message}`)
        throw error
    }
}


const disconnectRedis = async() => {
    if(!redis) return 

    try {
        if(redis.status === 'ready' || redis.status === 'connect') {
            await redis.quit()
            console.log('[INFO] Redis: Connection pool terminated gracefully.')
        } else {
            redis.disconnect()
        }
    } catch(error) {
        console.error(`[ERROR] Redis: Graceful shutdown failed: ${error.message}`)
        try {
            redis.disconnect()
        
        } catch(error) {
            console.error(`[ERROR] Redis: Force disconnection failed: ${error.message}`)
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