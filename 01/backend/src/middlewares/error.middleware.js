const { AppError } = require('../utils/apperror.utils')
const { ZodError } = require('zod')

const notFoundHandler = (req, res, next) =>{    
    const appError = new AppError(`Route not found - ${req.originalUrl}.`, 404)
    
    next(appError)
}

const jsonSyntaxErrorHandler = (err, req, res, next) =>{
    
    const isJsonMalformed = err.status === 400 && err.type === 'entity.parse.failed'
    
    if (isJsonMalformed) {
        const appError = new AppError('Invalid JSON format in request body.', 400)

        return next(appError)
    }

    next(err)
}

const zodErrorHandler = (err, req, res, next) =>{ 
    
    if (err instanceof ZodError) {
        const issues = err.issues || err.errors || []

        const errors = issues.map((issue) =>{
            if(issue.code === 'unrecognized_keys'){
                return {
                    field: issue.keys?.join(', ') || 'unknown', 
                    message: 'This field is not recognized.'
                }
            }
            
            return {
                field: issue.path?.join('.'), 
                message: issue.message
            }
        })
        
        const appError = new AppError('Validation failed.', 400, errors)
        
        return next(appError)
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
    const type = err.isOperational ? 'CLIENT ERROR' : 'SERVER ERROR'
    const message = err.isOperational ? err.message : 'Internal server error'
    const location = err.stack.split('\n')[1]?.trim()
    
    // console.error(`\n[${statusCode}] ${req.method} ${req.originalUrl}`)
    console.error(`\n[${statusCode}] ${type} - ${err.message}`)
    console.error(`\t↳ ${location}\n`)

    const response = { 
        success: false, 
        message
    }  

    if(err.errors) response.errors = err.errors
    
    return res.status(statusCode).json(response)
}

module.exports = {
    notFoundHandler,
    jsonSyntaxErrorHandler,
    zodErrorHandler,
    // mongooseValidationErrorHandler,
    globalErrorHandler,
}