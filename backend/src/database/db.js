const mongoose = require('mongoose')
const config = require('../configs/env')
const { formatError } = require('../utils/formatError.utils')

let isShutdown = false

mongoose.connection.on('connected', () => {
    console.log(`[INFO] Database: Connection established on host: ${mongoose.connection.host}`)
})

mongoose.connection.on('reconnected', () => {
    console.log(`[INFO] Database: Connection re-established.`)
})

mongoose.connection.on('error', (error) => {
    console.error('[ERROR] Database: Connection error:', formatError(error))
})

mongoose.connection.on('disconnected', () => {
    if(isShutdown) {
        console.log('[INFO] Database: Connection closed gracefully.')
    } else {
        console.warn('[WARN] Database: Connection lost unexpectedly.')
    }
})

const connectDB = async () => {
    const { readyState } = mongoose.connection

    if(readyState === 1 || readyState === 2) {
        console.log('[INFO] Database: Connection already active or in progress. Skipping connection attempt.')
        return
    } 

    isShutdown = false

    try {
        await mongoose.connect(config.MONGODB_URI, {
            appName: config.APP_NAME,
            dbName: config.MONGODB_NAME,
            autoIndex: false,
        })
    } catch(error) {
        console.error('[CRITICAL] Database: Initial connection failed:', formatError(error))
        throw error
    }
}

const disconnectDB = async () => {
    const { readyState } = mongoose.connection

    if(readyState === 0) {
        console.log('[INFO] Database: Already disconnected. Skipping disconnection attempt.')
        return
    } 

    isShutdown = true

    try {
        await mongoose.disconnect()      
    } catch(error) {
        console.error('[ERROR] Database: Connection termination failed:', formatError(error))
    }
}

module.exports = { 
    connectDB,
    disconnectDB 
}
