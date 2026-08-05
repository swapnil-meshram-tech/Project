const { AppError } = require('../utils/apperror.utils')

const rejectEmptyRequestBody = (req, res, next) =>{
    
    // if (req.headers['content-length'] === '0') {
    //     const appError = new AppError('Request body cannot be empty.', 400)
        
    //     return next(appError)
    // }

    const hasAnyProperty = (obj) => {
        for (const key in obj) {
            return true
         }
        return false
    }            

    if (!req.body || !typeof req.body === 'object' || !hasAnyProperty(req.body)) {
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
