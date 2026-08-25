const dotenv = require('dotenv')
dotenv.config()

const REQUIRED_ENV_VARS = [
    'PORT', 
    'CORS_ORIGINS', 
    'MONGODB_URI', 
    'MONGODB_NAME', 
    'REDIS_HOST', 
    'REDIS_PORT', 
    'REDIS_PASSWORD', 
    'JWT_ACCESS_SECRET', 
    'JWT_REFRESH_SECRET',
    'OTP_SECRET_KEY',
    'RESEND_API_KEY', 
    'RESEND_EMAIL_FROM',
    'AI_API_KEY', 
    'AI_BASE_URL', 
    'AI_MODEL'
]

REQUIRED_ENV_VARS.forEach((envVar) =>{
    const value = process.env[envVar]
    if(!value || String(value).trim() === ''){
         throw new Error(`Environment configuartion error: Required ${envVar} environment variable.`)
    }
})

const config = {
    PORT: parseInt(process.env.PORT, 10) || 5000, 
    CORS_ORIGINS: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:3000'],
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_NAME: process.env.DB_NAME,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: parseInt(process.env.REDIS_PORT,10),
    REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    OTP_SECRET_KEY: process.env.OTP_SECRET_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_EMAIL_FROM: process.env.RESEND_EMAIL_FROM,
    AI_API_KEY: process.env.AI_API_KEY,
    AI_BASE_URL: process.env.AI_BASE_URL,
    AI_MODEL: process.env.AI_MODEL,
}

module.exports = config