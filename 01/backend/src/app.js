const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const mongoSanitize = require('express-mongo-sanitize')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const compress = require('./middlewares/compression.middleware')
const { apiLimiter, authLimiter } = require('./middlewares/ratelimiter.middleware')
const config = require('../src/configs/env')
const authRouter = require('./routes/auth.routes')
const adminRouter = require('./routes/admin.routes')
const userRouter = require('./routes/user.routes')
const { notFoundErrorHandler, globalErrorHandler } = require('./middlewares/error.middleware')

const app = express()

app.set('trust proxy', 1)

app.use(helmet())

app.use(cors({
    origin: [
        config.CORS_ORIGIN_1,
        config.CORS_ORIGIN_2,
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}))

app.use(compress)

app.use(morgan('dev'))

app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ limit: '10kb', extended: true }))

app.use(cookieParser())

// app.use(mongoSanitize({
//   allowDots: false,        // strip keys with dots (default: false = strip them)
//   replaceWith: '_',
// }))

app.get('/', (req, res) =>{
    res.send('server is running.');
    // res.status(200).json({
    //     success: true,
    //     message: 'Server is Active.'
    // })
})

app.get('/health', (req, res)=>{
    res.status(200).json({
        success: true,
        message: 'Server is Active.'
    })
})

// app.use('/api/v1/auth', authLimiter, authRouter)
// app.use('/api/v1', apiLimiter)

app.use('/api/v1/auth', authRouter)

// app.use('/api/v1/admin', adminRouter)
// app.use('/api/v1/user', userRouter)

app.use(notFoundErrorHandler)
app.use(globalErrorHandler)

module.exports = app