const { AppError } = require('../utils/apperror.utils')
const { ZodError } = require('zod')

const notFoundHandler = (req, res, next) =>{    
    const error = new AppError(`Route not found - ${req.originalUrl}`, 404)
    
    next(error)
}

const jsonSyntaxErrorHandler = (err, req, res, next) =>{
    
    const isJsonMalformed = err.status === 400 && err.type === 'entity.parse.failed'
    
    if (isJsonMalformed) {
        const error = new AppError('Invalid JSON format in request body.', 400)

        return next(error)
    }

    next(err)
}

const zodErrorHandler = (err, req, res, next) =>{
    if (err instanceof ZodError) {
        const issues = err.issues || []

        const errors = issues.map((issue) =>{
            
            if(issue.code === 'unrecognized_keys'){
                return {
                    field: issue.keys?.join(', ') || 'unknown', 
                    message: 'This field is not recognized.'
                }
            }
            
            console.log(issue)
            console.log(issue.code)
            return {
                field: issue.path?.join('.'), 
                message: issue.message
            }
        })

        // console.log(errors)
        
        err = new AppError('Validation Failed', 400, errors)
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
    
    return res.status(statusCode).json({
        success: false,
        message
    })
}

module.exports = {
    notFoundHandler,
    jsonSyntaxErrorHandler,
    zodErrorHandler,
    // mongooseValidationErrorHandler,
    globalErrorHandler,
}