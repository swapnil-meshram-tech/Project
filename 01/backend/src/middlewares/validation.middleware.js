const { object } = require('zod')
const { AppError } = require('../utils/apperror.utils')

const contentTypeGuard = (req, res, next) => {
    const isMethod = ['POST', 'PUT', 'PATCH'].includes(req.method)
    const isJson = req.is('application/json')

    if (isMethod && !isJson) {
        const error = new AppError('Content-Type must be application/json.', 415)    
        
        return next(error)
    }

    next()
}

const hasAnyProperty = (obj) => {
    for (const key in obj) {
        if (Object.hasOwn(obj, key)) return true
    }

    return false
} 

const requireValidObjectBody = (req, res, next) => {
    const isBodyMalformed = !req.body || (typeof req.body !== 'object') || Array.isArray(req.body)
    const isEmptyObject = !isBodyMalformed && !hasAnyProperty(req.body)

    if (isBodyMalformed || isEmptyObject) {
        console.log(req.path);
        console.log(req.originalUrl);
        
        if (req.originalUrl === '/api/v1/auth/login') {
             const appError = new AppError(' r Invalid credentials.', 401)
            
            return next(appError)
        }

        const message = isBodyMalformed ? 'r Request body must be a valid JSON object.' : 'Request body cannot be empty.'

        const appError = new AppError(message, 400)
        return next(appError)
    }

    next()
}

const validateSchema = (schema) => (req, res, next) => {
    try{
        schema.parse(req.body)   
        next()

    } catch(err){
        next(err)
    }
}

module.exports = {
    contentTypeGuard,
    requireValidObjectBody,
    validateSchema
}
