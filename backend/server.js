const http = require('http')
const app = require('./src/app')
const config = require('./src/configs/env')
const { connectDB, disconnectDB } = require('./src/database/db')
const { getRedis, connectRedis, disconnectRedis } = require('./src/redis/client')

let server = null 

const startServer = async() => {
    try {
        console.log(`\n[INFO] Server: Connecting databases ...`)

        await connectDB()
        await connectRedis()
        
        server = http.createServer(app)

        server.on('error', (error) => {
            console.error('\n[ERROR] Server:', {
                code: error.code,
                message: error.message
            })
            
            process.exit(1)
        })
        
        server.listen(config.PORT, '0.0.0.0', () =>{
           console.log(`\n[INFO] Server: Running on port http://localhost:${config.PORT}`)
        })
        
    } catch(error){
        console.error(`[ERROR] Server: Startup failed: ${error}`)
        process.exit(1)
    }
}

startServer()

process.on('unhandledRejection', (error) => {
    console.error(`[CRITICAL] Server: Unhandled Rejection: ${error}`)
    process.exit(1)
})

process.on('uncaughtException', (error) => {
    console.error(`[CRITICAL] Server: Uncaught Exception: ${error}`)
    process.exit(1)
})


const handleGracefulShutdown = async (signal) => {
    console.log(`\n[INFO] Server: ${signal} received. Initiating graceful shutdown ...`)
            
    const forceTimeout = setTimeout(() => {
        console.error('[ERROR] Server: Forced shutdown triggered.')
        process.exit(1)
    }, 15000)
            
    try {
        if(server){
            server.closeAllConnections()

            await new Promise((resolve, reject) => {
                server.close(() =>{
                    console.log('[INFO] Server: HTTP port network listener completely closed.')
                    resolve()  
                })
            })
        }

        await disconnectDB()
        await disconnectRedis()

        clearTimeout(forceTimeout)
        
        console.log('[INFO] Server: System stoped gracefully.')
        process.exit(0)

    } catch (err) {
        clearTimeout(forceTimeout)

        console.error('[ERROR] Server: Shutdown failed:', err.message)
        process.exit(1)
    }
}

process.on('SIGINT', () => handleGracefulShutdown('SIGINT'))
process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM')) // For cloud servers
        

