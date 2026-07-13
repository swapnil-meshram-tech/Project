const testing = (req, res, next) =>{
    try{
        res.status(401).json({
                success: true,
                message: 'Testing.',
                req: req.user,
                cookie: req.cookies
            })
    } catch(err){
        console.error(`Test error: ${err.message}`);
    }
}

module.exports = {
    testing
}