class AppError extends Error {
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode
        this.isOperational = true   // marks this as an expected, deliberately-thrown error

        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = {
    AppError
}