const { AppError } = require('../utils/apperror.utils')

const contentTypeGuard = (req, res, next) => {
    if (["POST", "PUT", "PATCH"].includes(req.method) && !req.is("application/json")) {

        // if (req.originalUrl.includes('/login')) {
        //      const appError = new AppError('Invalid credentials.', 401)
            
        //     // return next(appError)
            
        //     return res.status(401).json({
        //         message: 'Invalid c'
        //     })
        // }

        const error = new AppError('Request body cannot be empty.', 400)
            
        return next(error)
    }

    next()
}

const rejectEmptyRequestBody = (req, res, next) =>{

    const hasAnyProperty = (obj) => {
        for (const key in obj) {
            return true
         }
        return false
    }            

    if (!req.body || (typeof req.body !== 'object') || !hasAnyProperty(req.body)) {
        
        if (req.originalUrl.includes('/login')) {
             const appError = new AppError('Invalid credentials.', 401)
            
            // return next(appError)
            
            return res.status(401).json({
                message: 'Invalid c'
            })
        }

        const error = new AppError('Request body cannot be empty.', 400)
            
        return next(error)
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
    rejectEmptyRequestBody,
    validateSchema
}
