import { AppError } from "../../utils/AppError.js"
import { catchError } from "../../utils/catchError.js"
import slugify from "slugify"

export const addOne = (model, name)=>{
    return catchError(
        async(req, res, next)=>{
            req.body.slug = slugify(req.body.name)
            const document = new model(req.body)
            await document.save()
            let response= {}
            response[name] = document
            return res.status(201).json({message: "success", ...response})
        }
    )
}

export const getAll = (model, name)=>{
    return catchError(
        async(req, res, next)=>{
            let filter = {}
            if(req.params.categoryId){
                filter = {category: req.params.categoryId}
            }
            const document = await model.find(filter)
            let response= {}
            response[name] = document
            return res.status(201).json({message: "success", ...response})
        }
    )
}

export const getOne = (module, name) =>{
    return catchError (
        async(req,res,next)=> {
            const {id} = req.params
            const document = await module.findById(id)
            let response= {}
            response[name] = document
            return res.status(201).json({message: "success", ...response})
        }
    )
}

export const updateOne = (model, name) =>{
    return catchError(
        async(req, res, next)=>{
            const {id} = req.params
            if(req.body.name) req.body.slug = slugify(req.body.name)
            const document = await model.findByIdAndUpdate(id, req.body, {new: true})
            !document && next(new AppError(`${name} not found`, 404))
            let response= {}
            response[name] = document
            document && res.status(201).json({message: "success", ...response})
        }
    )
}

export const deleteOne = (model, name) =>{
    return catchError(
        async(req, res, next)=>{
            const {id} = req.params
            const document = await model.findByIdAndDelete(id)
            !document && next(new AppError(`${name} not found`, 404))
            document && res.status(201).json({message: "success"})
        }
    )
}





