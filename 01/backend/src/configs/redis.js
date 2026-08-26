const Redis = require('ioredis')
const config = require('../configs/env')

const MAX_CONNECTION_RETRIES = 10

let redis = null

const getRedis = () => {
    // console.log(redis);

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
                    console.error('Redis failure: Maximum reconnect attempts reached. Stopping retries.')
                    return false
                }
                
                const delay = Math.min(Math.pow(2, times - 1) * 50, 4000)
                const jitter = Math.floor(Math.random() * 250)

                return delay + jitter
                // return Math.min(Math.pow(2, times - 1) * 50, 2000)
            }
        })

        redis.on('connect', () => console.log('Redis: TCP socket connection established.'))
        
        redis.on('ready', () => console.log('Redis: Client state is ready to process.'))
        
        redis.on('error', (error) => {
            console.error(`Redis Error: ${error.message || error}`)
        })

        redis.on('reconnecting', (delay) => console.warn(`\nRedis: Attempting reconnection in ${delay} ms.`))
       
        redis.on('end', () => {
            console.error(`\nRedis: Connection pool has been permanently closed.`)
            process.exit(1)
        })
    }
    // console.log(redis.status);
    return redis
}


const connectRedis = async() => {
    const client = getRedis()
    // console.log(client.status);
    
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
        console.error(`Redis: Startup failed: ${error.message}`)
        
        throw error
    }
}


const disconnectRedis = async() => {
    if(!redis) return 

    try {
        if(redis.status === 'ready' || redis.status === 'connect') {
            await redis.quit()
            console.log('Redis: Connection pool terminated gracefully.')
        } else {
            redis.disconnect()
        }
    } catch(error) {
        console.error(`Redis: Graceful shutdown failed: ${error.message}`)
        try {
            redis.disconnect()
        
        } catch(error) {
            console.error(`Redis: Force disconnection failed: ${error.message}`)
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