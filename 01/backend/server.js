const http = require('http')
const app = require('./src/app')
const { connectDB, disconnectDB } = require('./src/configs/db')
const { getRedis, connectRedis, disconnectRedis } = require('./src/configs/redis')
const config = require('./src/configs/env')

let server = null 

const startServer = async() => {
    try {
        await connectDB()
        await connectRedis()
        
        server = http.createServer(app)
        
        server.on('error', (error) => {
            console.error(`\nServer error: ${error.message}`)
            process.exit(1)
        })
        
        server.listen(config.PORT, () =>{
           console.log(`\nServer: Running on port http://localhost:${config.PORT}`)
        })
        
    } catch(error){
        console.error(`Server: Startup failed: ${error}`)
        process.exit(1)
    }
}

startServer()


process.on('unhandledRejection', (error) => {
    console.error(`Unhandled Rejection: ${error}`)
    process.exit(1)
})

process.on('uncaughtException', (error) => {
    console.error(`Uncaught Exception: ${error}`)
    process.exit(1)
})


const handleGracefulShutdown = async (signal) => {
    console.log(`[ShutDown] ${signal} received. Shutting down...`)
            
    const forceTimeout = setTimeout(() => {
        console.error('Forced shutdown triggered: Connections failed to close in time.')
        process.exit(1)
    }, 15000)

    clearTimeout(forceTimeout) // Clear the safety timer on clean exit
            
    try {
        await disconnectDB()
        await disconnectRedis()
        
        console.log('Server shut down.')
        process.exit(0)
    } catch (err) {
        console.error('Shut down failed:', err.message)
        process.exit(1)
    }
 }


process.on('SIGINT', () => handleGracefulShutdown('SIGINT'))
process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM')) // For cloud servers
        

