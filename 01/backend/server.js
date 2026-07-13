const http = require('http')
const app = require('./src/app')
const { connectDB, disconnectDB } = require('./src/configs/db')
const { connectRedis } = require('./src/configs/redis')
const config = require('./src/configs/env')

const startServer = async() =>{
    try{
        await connectDB()
        await connectRedis()
        
        const server = http.createServer(app)
        
        server.on('error', (err) => {
            console.error('Server error:', err.message)
            process.exit(1)
        })
        
        server.listen(config.PORT, () =>{
           console.log(`Server running on: http://localhost:${config.PORT}`)
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

        process.on('SIGTERM', () => shutdown('SIGTERM')) // For cloud servers
        process.on('SIGINT', () => shutdown('SIGINT'))
        
    } catch(err){
        console.error('Server startup error:', err)
        process.exit(1)
    }
}


process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err.message)
    process.exit(1)
})

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err.message)
    process.exit(1)
})

startServer()