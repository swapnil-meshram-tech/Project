const http = require('http')
const app = require('./src/app')
const { connectDB, disconnectDB } = require('./src/configs/db')
const { connectRedis } = require('./src/configs/redis')
const config = require('./src/configs/env')

let server = null 

const startServer = async() => {
    try {
        await connectDB()

        // try {
            await connectRedis()

        // } catch(redisError) {
        //     console.warn(`Warning: Server starting without Redis cache: ${redisError.message}`)
        // }
        
        server = http.createServer(app)
        
        server.on('error', (error) => {
            console.error(`\nServer error: ${error.message}`)
            process.exit(1)
        })
        
        server.listen(config.PORT, () =>{
           console.log(`\nServer running on: http://localhost:${config.PORT}`)
        })
        
    } catch(error){
        console.error(`Server startup error: ${error}`)
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


const shutdown = async (signal) => {
    console.log(`${signal} received. Shutting down...`)
            
    const forceTimeout = setTimeout(() => {
        console.error('Forced shutdown triggered: Connections failed to close in time.')
        process.exit(1)
    }, 15000)

    server.close(async () => {
        clearTimeout(forceTimeout) // Clear the safety timer on clean exit
                
        try {
            await disconnectDB()
            console.log('Server shut down.')
            process.exit(0)
        } catch (err) {
            console.error('Error during shut down:', err.message)
            process.exit(1)
        }
    })
 }


process.on('SIGINT', () => gracefulShutdown('SIGINT'))
process.on('SIGTERM', () => gracefulshutdown('SIGTERM')) // For cloud servers
        

