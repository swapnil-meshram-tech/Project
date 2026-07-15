const { AppError } = require('../utils/apperror.utils')

const notFoundErrorHandler = (req, res, next) =>{
    const err = new AppError(`Not Found - ${req.originalUrl}`, 404)
    next(err)
}

const globalErrorHandler = (err, req, res, next) =>{
    const statusCode = err.statusCode || 500
    
    if(err.isOperational) {
       const location = err.stack.split('\n')[1]?.trim() // grabs the first "at ..." line
       
       console.error(`[${statusCode}] ${req.method} ${req.originalUrl} 
    - ${err.message}`)
       console.error(`       ↳ ${location}`)
    } else {
        // Unexpected/real bug — log full details, you need this to debug
        console.error(err)
    }
    
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