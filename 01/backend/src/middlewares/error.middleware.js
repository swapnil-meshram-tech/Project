const { AppError } = require('../utils/apperror.utils')
const { ZodError } = require('zod')

const notFoundErrorHandler = (req, res, next) =>{
    const err = new AppError(`Not Found - ${req.originalUrl}`, 404)

    next(err)
}

const jsonSyntaxErrorHandler = (err, req, res, next) =>{
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        err = new AppError('Invalid JSON format in request body.', 400)
    }

    next(err)
}

const zodErrorHandler = (err, req, res, next) =>{
    if (err instanceof ZodError) {
        const firstIssue = err.errors[0]
        const fieldName = firstIssue?.path[0]
        const message = firstIssue?.message || 'Inavlid input.'
        err = new AppError(message, 400)
    }

    next(err)
}


const mongooseValidationErrorHandler = (err, req, res, next) =>{
    if (err.name === 'ValidationError' && err.errors) {
        const firstField = Object.keys(err.errors)[0]
        const message = err.errors[firstField]?.message || 'Inavlid input.'
        err = new AppError(message, 400)
    }

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
    jsonSyntaxErrorHandler,
    zodErrorHandler,
    globalErrorHandler,
}