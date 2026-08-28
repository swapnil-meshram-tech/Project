const { AppError } = require('../utils/apperror.utils')

// const contentTypeGuard = (req, res, next) => {
//     const isMethod = ['POST', 'PUT', 'PATCH'].includes(req.method)
//     const isJson = req.is('application/json')

//     if (isMethod && !isJson) {
//         const error = new AppError('Content-Type must be application/json.', 415)    
        
//         return next(error)
//     }

//     next()
// }

const validateSchema = (schema) => (req, res, next) => {
    try{
        schema.parse(req.body)   
        next()

    } catch(err){
        next(err)
    }
}

module.exports = {
    // contentTypeGuard,
    validateSchema
}
