const mongoose = require('mongoose')
const config = require('../configs/env')

const connectDB = async() =>{
    try{
        const connect = await mongoose.connect(`${config.MONGODB_URI}/${config.DB_NAME}`)
        console.log(`DB connected: ${connect.connection.host}`)
        
    } catch(err){
        console.error('DB connection error:', err.message)
        process.exit(1)
    }
}

const disconnectDB = async () => {
    try {
        await mongoose.connection.close()
        console.log('DB disconnected.')

    } catch (err) {
        console.error('DB disconnection error:', err.message)
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
