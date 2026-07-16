const { AppError } = require('../utils/apperror.utils')

const notFoundErrorHandler = (req, res, next) =>{
    const err = new AppError(`Not Found - ${req.originalUrl}`, 404)
    next(err)
}

const globalErrorHandler = (err, req, res, next) =>{
    const statusCode = err.statusCode || 500
    const location = err.stack.split('\n')[1]?.trim()
    const type = err.isOperational ? 'CLIENT ERROR' : 'SERVER ERROR'
    
    console.error(`\n[${statusCode}] ${req.method} ${req.originalUrl}`)
    console.error(`\n${type} - ${err.message}`)
    console.error(`\t↳ ${location}\n`)
    
    const message = err.isOperational ? err.message : 'Internal server error'

    return res.status(statusCode).json({
        success: false,
        message
    })
}

module.exports = {
    notFoundErrorHandler,
    globalErrorHandler,
}