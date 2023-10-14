import { ApiFeatures } from "../../utils/ApiFeatures.js"
import { AppError } from "../../utils/AppError.js"
import { catchError } from "../../utils/catchError.js"
import qrcode from 'qrcode'
import cloudinary from "../../utils/cloudinary.js"

export const addOne = (model, name)=>{
    return catchError(
        async(req, res, next)=>{
            if(name === 'review'){
                req.body.user = req.user._id
                // check if user created review before or not on the product
                const isReview = await model.findOne({user: req.user._id, product: req.body.product})
                if(isReview) return next(new AppError(`You created a review before`, 409)); 
            }

           if(req.file){
                const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path, {folder: `ecommerce/${name}`})
                req.body.imgCover ={secure_url, public_id}
           }

            const document = new model(req.body)
            await document.save()
            let response = {}
            response[name] = document
            return res.status(201).json({message: "success", cloud, ...response})
        }
    )
}

export const getAll = (model, name)=>{
    return catchError(
        async(req, res, next)=>{
            const apiFeatures = new ApiFeatures(model.find(), req.query)
            .paginate().fields().filter().sort().search()
             
            // exeute query
            const document = await apiFeatures.mongooseQuery
            let response= {}
            response[name] = document
            return res.status(201).json({
                message: "success",
                resulte: document.length,
                pageNumber: apiFeatures.pageNumber,
                ...response
            })
        }
    )
}

export const getOne = (model, name) =>{
    return catchError (
        async(req,res,next)=> {
            const {id} = req.params
            const document = await model.findById(id)
            if (!document) return next(new AppError(`${name} not found`, 404));
            let response = {}
            response[name] = document

            if(name === 'coupon'){
                const url = await qrcode.toDataURL(document.code)
                response['qrcode'] = url;
            }
            return res.status(201).json({message: "success", ...response})
        }
    )
}


export const updateOne = (model, name) =>{
    return catchError(
        async(req, res, next)=>{
            const {id} = req.params

            if(name === 'review'){
                const review = await model.findOneAndUpdate({_id: id, user: req.user._id}, req.body, {new: true})
                !review && next(new AppError(`${name} not found or you are not authorized to perform this action`, 404))
            }

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





