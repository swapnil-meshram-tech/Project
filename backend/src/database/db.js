const mongoose = require('mongoose')
const config = require('../configs/env')
const { formatError } = require('../utils/formatError.utils')

let isShutdown = false

mongoose.connection.on('connected', () => {
    console.log(`[INFO] Database: Connection established on host: ${mongoose.connection.host}`)
})

mongoose.connection.on('error', (error) => {
    console.error('[ERROR] Database: Connection error:', formatError(error))
})

mongoose.connection.on('disconnected', () => {
    if(isShutdown) {
        console.log('[INFO] Database: Connection closed safely.')
    } else {
        console.warn('[WARN] Database: Connection lost unexpectedly. Mongoose will attempt reconnection.')
    }
})

const connectDB = async () => {
    const { readyState } = mongoose.connection

    if(readyState === 1 || readyState === 2) {
        console.log('[INFO] Database: Connection already active or in progress. Skipping reconnection attempt.')
        return
    } 

    isShutdown = false

    try {
        await mongoose.connect(config.MONGODB_URI, {
            dbName: config.MONGODB_NAME,
            autoIndex: false,
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            maxPoolSize: 50,
            minPoolSize: 5,
        })

    } catch(error) {
        console.error('[CRITICAL] Database: Initial startup connection failed:', formatError(error))
        throw error
    }
}

const disconnectDB = async () => {
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
