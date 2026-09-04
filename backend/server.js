const http = require('node:http')
const app = require('./src/app')
const config = require('./src/configs/env')
const { connectDB, disconnectDB } = require('./src/database/db')
const { getRedisClient, connectRedis, disconnectRedis } = require('./src/redis/client')
const { formatError } = require('./src/utils/formatError.utils')

const SHUTDOWN_TIMEOUT = 30_000

let server = null 
let isShutdown = false

const startServer = async () => {
    try {
        console.log('\n[INFO] Server: Connecting to Database ...')
        await connectDB()

        console.log('\n[INFO] Server: Connecting to Redis ...')
        await connectRedis()
        
        server = http.createServer(app)

        server.on('error', (error) => {
            console.error('\n[ERROR] Server: HTTP server error:', formatError(error))
            
            if(error.code === 'EADDRINUSE' || error.code === 'EACCES'){
                handleGracefulShutdown('serverError')
                return 
            }

            process.exit(1)
        })
        
        server.listen(config.PORT, config.HOST, () =>{
        //    console.log(`\n[INFO] Server: Running on port http://localhost:${config.PORT}`)
           console.log(`\n[INFO] Server: Running on http://${config.HOST}:${config.PORT}`)
        })
        
    } catch(error){
        console.error('[CRITICAL] Server: Initial startup failed:', formatError(error))
        
        try{
            await disconnectRedis()
        } catch(cleanupError){
            console.error('[CRITICAL] Server: Redis cleanup failed:', formatError(cleanupError))
        }

        try{
            await disconnectDB()
        } catch(cleanupError){
            console.error('[CRITICAL] Server: Database cleanup failed:', formatError(cleanupError))
        }

        process.exit(1)
    }
}

const handleGracefulShutdown = async (signal) => {
    if(isShutdown) {
        console.warn(`\n[WARN] Server: Shutdown already in progress. Ignoring ${signal}.`)
        return
    }

    isShutdown = true
    
    console.log(`\n[INFO] Server: ${signal} received. Initiating graceful shutdown ...`)
            
    const forceShutdownTimer = setTimeout(() => {
        console.error('[ERROR] Server: Graceful shutdown timed out. Forcing exit.')
        process.exit(1)
    }, SHUTDOWN_TIMEOUT)

    forceShutdownTimer.unref()
            
    try {
        if(server){
            await new Promise((resolve, reject) => {
                server.close((error) =>{
                    if(error) {
                        console.log('[INFO] Server: HTTP server closed or bypassed. Code:', error.code || 'unknown')
                    } else {
                        console.log('[INFO] Server: HTTP server closed.')
                    }
                        
                    resolve()  
                })
            })
        }

        await disconnectDB()
        await disconnectRedis()

        clearTimeout(forceShutdownTimer)

        console.log('[INFO] Server: Shutdown completed successfully.')
        process.exit(0)

    } catch(error) {
        clearTimeout(forceShutdownTimer)

        console.error('[ERROR] Server: Graceful shutdown failed:', formatError(error))
        process.exit(1)
    }
}

process.on('unhandledRejection', (error) => {
    console.error('[CRITICAL] Server: Unhandled Rejection:', formatError(error))
    handleGracefulShutdown('unhandledRejection')
})

process.on('uncaughtException', (error) => {
    console.error('[CRITICAL] Server: Uncaught Exception:', formatError(error))
    process.exit(1)
})

process.on('SIGINT', () => handleGracefulShutdown('SIGINT'))
process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM')) // For cloud servers

startServer()