const { AppError } = require('../utils/apperror.utils')

const rejectEmptyRequestBody = (req, res, next) =>{
       
    if (req.headers['content-length'] === '0') {
        const error = new AppError('Request body cannot be empty.', 400)
        
        return next(error)
    }

    const isBodyValid = req.body && 
                        typeof req.body === 'object' && 
                        Object.keys(req.body)[0] !== undefined

    if (!isBodyValid) {
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
