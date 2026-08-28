const mongoose = require('mongoose')
const config = require('../configs/env')

let isShutdown = false

mongoose.connection.on('connected', () => {
    console.log(`[INFO] Database: Connection established on host: ${mongoose.connection.host}`)
})

mongoose.connection.on('error', (error) => {
    console.error('[ERROR] Database: Runtime exception occurred:', {
        name: error.name,
        message: error.message
    })
})

mongoose.connection.on('disconnected', () => {
    if(isShutdown) {
        console.log('[INFO] Database: Connection pool closed safely.')
    } else {
        console.warn('[WARN] Database: Connection lost unexpectedly. Mongoose will attempt reconnection.')
    }
})

const connectDB = async() => {
    const { readyState } = mongoose.connection

    if(readyState === 1 || readyState === 2) {
        console.log('[INFO] Database: Connection already active or in progress. Skipping connection attempt.')
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
        console.error('[CRITICAL] Database: Initial startup connection failed:', {
            name: error.name,
            message: error.message
        })
        throw error
    }
}

const disconnectDB = async() => {
    isShutdown = true

    try {
        await mongoose.disconnect()      

    } catch(error) {
        console.error('[ERROR] Database: Connection pool termination failed:', {
            name: error.name,
            message: error.message
        })
    }
}



module.exports = { 
    connectDB,
    disconnectDB 
}
