const { AppError } = require('../utils/apperror.utils')
const { ZodError } = require('zod')

const notFoundHandler = (req, res, next) =>{    
    const appError = new AppError(`Route not found.`, 404)
    
    next(appError)
}

const jsonSyntaxErrorHandler = (err, req, res, next) =>{
    const isJsonMalformed = (err.status === 400 || err.statusCode === 400) && err.type === 'entity.parse.failed'
    
    if (isJsonMalformed) {

        if (req.path === '/api/v1/auth/login') {
            const appError = new AppError('Invalid credentials.', 401) 
            return next(appError)
        }

        const appError = new AppError('Invalid JSON format in request body.', 400)
        return next(appError)
    }

    next(err)
}

const zodErrorHandler = (err, req, res, next) =>{ 
    
    if (err instanceof ZodError) {

        if (req.originalUrl.includes('/login')) {
            const appError = new AppError('Invalid credentials.', 401)
            
            return next(appError)

            // return res.status(401).json({
            //     message: 'Invalid c'
            // })
        }

        const issues = err.issues || err.errors || []
        // console.log('zodErrorHandler HIT, raw issues:', err.issues.length);
        // console.log('zodErrorHandler HIT, raw issues:', JSON.stringify(err.issues, null, 2));
        // // const errors = issues.map((issue) =>{
        // //     if(issue.code === 'unrecognized_keys'){
        // //         return {
        // //             field: issue.keys?.join(', ') || 'unknown', 
        // //             message: 'This field is not recognized.'
        // //         }
        // //     }

        // //     if(issue.code === 'invalid_type'){
        // //         return {
        // //             field: issue.path?.join('.'), 
        // //             message: issue.message
        // //         }
        // //     }

        // //     return null
            
        // //     // return {
        // //     //     field: issue.path?.join('.'), 
        // //     //     message: issue.message
        // //     // }
        // // }).filter(Boolean)

        // // const errors = []

        // // for (const issue of issues) {
        // //     if (issue.code === 'unrecognized_keys') {
        // //         errors.push({
        // //             field: issue.keys?.join(', ') || 'unknown',
        // //             message: 'This field is not recognized.'
        // //         })
        // //         continue
        // //     }
        
        // //     const field = issue.path?.join('.')
        // //     if (seen.has(field)) continue
        
        // //     seen.add(field)
        // //     errors.push({ field, message: issue.message })
        // // }

        const invalidTypeFields = new Set()
        const errors = []
    
        for (const issue of err.issues) {
            if (issue.code === 'unrecognized_keys') {
                for (const key of issue.keys){
                    errors.push({ 
                    // field: issue.keys?.join(', '), 
                    field: key, 
                    message: 'This field is not recognized.' 
                    })
                }
                continue
            }

            const field = issue.path?.join('.') || 'unknown'
            const message = issue.message || 'Invalid input'

            if (issue.code === 'invalid_type') {
                invalidTypeFields.add(field)
                
                errors.push({ 
                    field,
                    message
                })

                continue
            }

            if (invalidTypeFields.has(field))  continue

            errors.push({
                field,
                message: issue.message
            })
        }

        console.log(errors);

        const appError = new AppError('Validation failed.', 400, errors)
        
        return next(appError)
    }

    next(err)
}

const mongooseValidationErrorHandler = (err, req, res, next) =>{
    if (err.name === 'ValidationError' && err.errors) {
        const firstField = Object.keys(err.errors)[0]
        const message = err.errors[firstField]?.message || 'Inavlid input.'
        
        appError = new AppError(message, 400)
        return next(appError)
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