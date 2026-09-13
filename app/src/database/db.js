const mongoose = require('mongoose')
const config = require('../configs/env')
const { formatError } = require('../utils/formatError.utils')

const RETRIES = 5 
const BASE_DELAY = 2000

let isShutdown = false
let hasConnectedOnce = false

mongoose.connection.on('connected', () => {
    hasConnectedOnce = true
    console.log(`[INFO] Database: Connection established on host: ${mongoose.connection.host}`)
})

mongoose.connection.on('reconnected', () => {
    console.log(`[INFO] Database: Connection re-established.`)
})

mongoose.connection.on('error', (error) => {
    console.error('[ERROR] Database: Connection error:', formatError(error))
})

mongoose.connection.on('disconnected', () => {
    if(!hasConnectedOnce) return 

    if(isShutdown) {
        console.log('[INFO] Database: Connection closed gracefully.')
    } else {
        console.warn('[WARN] Database: Connection lost unexpectedly.')
    }
})

const connectDB = async () => {
    const { readyState } = mongoose.connection

    if(readyState === 1 || readyState === 2) {
        console.log('[INFO] Database: Connection request skipped (already connected or connecting).')
        return
    } 

    isShutdown = false

    for(let attempt = 1; attempt <= RETRIES; attempt++){
        try {
            await mongoose.connect(config.MONGODB_URI, {
                appName: config.APP_NAME,
                dbName: config.MONGODB_NAME,
                autoIndex: false,
                bufferCommands: false,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            })

            return 
            
        } catch(error) {
            console.error('[CRITICAL] Database: Initial connection failed:', formatError(error))
            
            if(attempt === RETRIES){
                console.error('[CRITICAL] Database: Connection attempts exhausted.')

                throw error
            }

            const delay = BASE_DELAY * 2 ** (attempt - 1)

            console.log(`[INFO] Database: Retrying connection in ${delay / 1000} sec.`) 

            await new Promise(resolve => setTimeout(resolve, delay))
        }
    }
}

const disconnectDB = async () => {
    const { readyState } = mongoose.connection

    if(readyState === 0 || readyState === 3) {
        console.log('[INFO] Database: Disconnection request skipped (already disconnected or disconnecting).')
        return
    } 

    isShutdown = true

    try {
        await mongoose.disconnect()

    } catch(error) {
        isShutdown = false

        console.error('[ERROR] Database: Connection termination failed:', formatError(error))
    }
}

module.exports = { 
    connectDB,
    disconnectDB 
}
