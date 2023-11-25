
export const validate = (schema)=>{
    return (req, res, next)=>{
        const inputs = {...req.params, ...req.boody, ...req.query}

        if (req.file || req.files) {
            inputs.file = req.file || req.files
        }

        const {error} = schema.validate(inputs, {abortEarly: false})
        const errors = []
        if (error) {
            error.details.forEach(element => {
                errors.push({message: element.message, field: element.path[0]})
            });
            return res.json({message: 'Invalid request data', errors})
        }
        next()
    }
}