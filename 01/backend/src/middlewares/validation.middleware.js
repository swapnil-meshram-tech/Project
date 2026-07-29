const { AppError } = require('../utils/apperror.utils')

const rejectEmptyRequestBody = (req, res, next) =>{
    const methods = ['POST', 'PUT', 'PATCH']

    if (methods.includes(req.method) && (!req.body || Object.keys(req.body).length === 0)) {
        const err = new AppError('Request body cannot be empty.', 400)
    
        return next(err)
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
