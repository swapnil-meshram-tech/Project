const { AppError } = require('../utils/apperror.utils')
const { ZodError } = require('zod')

const notFoundErrorHandler = (req, res, next) =>{    
    const error = new AppError(`Route not found - ${req.originalUrl}`, 404)
    
    next(error)
}

// const jsonSyntaxErrorHandler = (err, req, res, next) =>{
//     // console.log(err);
    
//     if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
//         const error = new AppError('Invalid JSON format in request body.', 400)

//         // next(error)
//     }

//     next()
// }

// const zodErrorHandler = (err, req, res, next) =>{
//     if (err instanceof ZodError) {
//         const firstIssue = err.errors[0]
//         const fieldName = firstIssue?.path[0]
//         const message = firstIssue?.message || 'Invalid input.'
//         err = new AppError(message, 400)
//     }

//     next(err)
// }

// const mongooseValidationErrorHandler = (err, req, res, next) =>{
//     if (err.name === 'ValidationError' && err.errors) {
//         const firstField = Object.keys(err.errors)[0]
//         const message = err.errors[firstField]?.message || 'Inavlid input.'
//         err = new AppError(message, 400)
//     }

//     next(err)
// }

const globalErrorHandler = (err, req, res, next) =>{
    const statusCode = err.statusCode || 500
    const type = err.isOperational ? 'CLIENT ERROR' : 'SERVER ERROR'
    const message = err.isOperational ? err.message : 'Internal server error'
    const location = err.stack.split('\n')[1]?.trim()
    
    // console.error(`\n[${statusCode}] ${req.method} ${req.originalUrl}`)
    console.error(`\n[${statusCode}] ${type} - ${err.message}`)
    console.error(`\t↳ ${location}\n`)
    
    return res.status(statusCode).json({
        success: false,
        message
    })
}

module.exports = {
    notFoundErrorHandler,
    // jsonSyntaxErrorHandler,
    // zodErrorHandler,
    // mongooseValidationErrorHandler,
    globalErrorHandler,
}