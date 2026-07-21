const dotenv = require('dotenv')
dotenv.config()

const envVars = ['PORT', 'MONGODB_URI', 'DB_NAME', 'REDIS_HOST', 'REDIS_PORT', 'REDIS_PASSWORD', 'CORS_ORIGIN_1', 'CORS_ORIGIN_2', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET', 'AI_API_KEY']

envVars.forEach((envVar) =>{
    const value = process.env[envVar]
    if(!value || value.trim() === ''){
         throw new Error(`Env. not found: ${envVar}`)
    }
})

const config = {
    PORT: process.env.PORT || 5000, 
    MONGODB_URI: process.env.MONGODB_URI,
    DB_NAME: process.env.DB_NAME,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    CORS_ORIGIN_1: process.env.CORS_ORIGIN,
    CORS_ORIGIN_2: process.env.CORS_ORIGIN2,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    AI_API_KEY: process.env.AI_API_KEY,
}

module.exports = config