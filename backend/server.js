const http = require('http')
const app = require('./src/app')
const config = require('./src/configs/env')
const { connectDB, disconnectDB } = require('./src/database/db')
const { getRedis, connectRedis, disconnectRedis } = require('./src/redis/client')
const { formatError } = require('./src/utils/formatError.utils')

let server = null 
let isShutdown = false

const startServer = async () => {
    try {
        console.log('\n[INFO] Server: Connecting to database ...')

        await connectDB()
        await connectRedis()
        
        server = http.createServer(app)

        server.on('error', (error) => {
            console.error('\n[ERROR] Server: Runtime error:', formatError(error))
            process.exit(1)
        })
        
        server.listen(config.PORT, '0.0.0.0', () =>{
        //    console.log(`\n[INFO] Server: Running on port http://localhost:${config.PORT}`)
           console.log(`\n[INFO] Server: Running on port 0.0.0.0:${config.PORT}`)
        })
        
    } catch(error){
        console.error('[CRITICAL] Server: Startup failure:', formatError(error))
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
            
    const forceTimeout = setTimeout(() => {
        console.error('[ERROR] Server: Graceful shutdown timed out. Forcing exit.')
        process.exit(1)
    }, 15000)
            
    try {
        if(server){
            await new Promise((resolve, reject) => {
                server.close((error) =>{
                    if(error) return reject(error)
                        
                    console.log('[INFO] Server: HTTP port network listener completely closed.')
                    resolve()  
                })
            })
        }

        await disconnectDB()
        await disconnectRedis()

        clearTimeout(forceTimeout)

        console.log('[INFO] Server: Shutdown gracefully.')
        process.exit(0)

    } catch (error) {
        clearTimeout(forceTimeout)

        console.error('[ERROR] Server: Graceful shutdown failure:', formatError(error))
        process.exit(1)
    }
}

process.on('unhandledRejection', async (error) => {
    console.error('[CRITICAL] Server: Unhandled Rejection:', formatError(error))
    try{
        await handleGracefulShutdown('unhandledRejection')
    } catch(shutdownError){
        console.error('[ERROR] Server: Failed during shutdown after unhandled rejection:', formatError(shutdownError))
    } finally {
        process.exit(1)
    }
})

process.on('uncaughtException', (error) => {
    console.error('[CRITICAL] Server: Uncaught Exception:', formatError(error))
    process.exit(1)
})

process.on('SIGINT', () => handleGracefulShutdown('SIGINT'))
process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM')) // For cloud servers

startServer()