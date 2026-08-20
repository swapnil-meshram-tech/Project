const { AppError } = require('../utils/apperror.utils')

const JSON_REQUIRED_METHODS = new Set(['POST', 'PUT', 'PATCH'])

const hasProperty = (obj) => {
    for (const key in obj) {
        if (Object.hasOwn(obj, key)) return true
    }

    return false
} 

const requireJsonContentType = (errorOptions = {}) => {
    return (req, res, next) => {
        const requiresMethod = JSON_REQUIRED_METHODS.has(req.method)

        if (requiresMethod && !req.is('application/json')) {
            const message = errorOptions.message || 'Content-Type must be application/json.'
            const status = errorOptions.status || 415
           
            const error = new AppError(message, status)    
            return next(error)
        }

        next()
    }
}

const requireValidObjectBody = (errorOptions = {}) => {
    return (req, res, next) => {
        const requiresMethod = JSON_REQUIRED_METHODS.has(req.method)

        const isValid =  (req.body !== null) && (typeof req.body === 'object') && !Array.isArray(req.body) 
        // && Object.keys(req.body).length > 0
        && hasProperty(req.body)

        if (requiresMethod && !isValid) {
            const message = errorOptions.message || 'o Request body must be a valid JSON object.'
            const status = errorOptions.status || 400
           
            const appError = new AppError(message, status)
            return next(appError)
        }

        next()
    }
}

module.exports = {
    requireJsonContentType,
    requireValidObjectBody
}