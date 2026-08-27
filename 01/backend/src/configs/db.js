const mongoose = require('mongoose')
const config = require('../configs/env')

const connectDB = async() =>{
    try{
        const connect = await mongoose.connect(config.MONGODB_URI, {
            dbName: config.MONGODB_NAME
        })
        console.log(`[INFO] Database: Connection established on host: ${connect.connection.host}`)
        
    } catch(error){
        console.error('[ERROR] Database: Initial connection failed:', error.message)
        process.exit(1)
    }
}

const disconnectDB = async() => {
    try {
        await mongoose.disconnect
        console.log('[INFO] Database: Connection pool closed.')

    } catch(error) {
        console.error(`[ERROR] Database: Termination failed: ${error.message}`)
    }
}

// mongoose.connection.on('connected', () =>{
//     console.log('DB connected.');
// })

// mongoose.connection.on('error', (err) =>{
//     console.error('DB error: ', err.message)
// })

// mongoose.connection.on('disconnected', () =>{
//     console.log('DB disconnected.')
// })

module.exports = { 
    connectDB,
    disconnectDB 
}
