export const globalError = (err, req, res, next)=>{
    const error = err.message
    const statusCode = err.statusCode || 500
    process.env.MODE == "dev" ? 
        res.status(statusCode).json({error, stack: err.stack}) :
        res.status(statusCode).json({error})
}