const compression = require('compression')

const skipTypes = [
    'image/',
    'video/',
    'audio/',
    'application/zip',
    'application/gzip',
    'application/pdf'
]

const compress = compression({
    threshold: 1024,          // Only compress if > 1KB
    level: 6,                 // Balanced compression
    filter: (req, res) => {
        const contentType = (res.getHeader('content-type') || '').toLowerCase()
        
        // Skip if already compressed format
        if (skipTypes.some(type => contentType.includes(type))) {
            return false
        }
        
        return compression.filter(req, res)
    }
})


module.exports = compress