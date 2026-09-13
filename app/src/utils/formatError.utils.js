const formatError = (error) => ({
    name: error.name,
    code: error.code,
    message: error.message,
    stack: error.stack,
})

module.exports = {
    formatError
}