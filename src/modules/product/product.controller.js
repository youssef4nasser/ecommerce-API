import slugify from "slugify"
import { productModel } from "../../../database/models/product.model.js"
import { ApiFeatures } from "../../utils/ApiFeatures.js"
import { catchError } from "../../utils/catchError.js"
import { AppError } from "../../utils/AppError.js"

export const addProduct = catchError(
    async(req, res, next)=>{
        const product = new productModel(req.body)
        await product.save()
        return res.status(201).json({message: "success", product})
    }
)

export const getAllProducts = catchError(
    async(req, res, next)=>{
        let apiFeatures = new ApiFeatures(productModel.find(), req.query)
        .paginate().fields().filter().sort().search()
        
        // exeute query
        const products = await apiFeatures.mongooseQuery
        
        return res.status(201).json({ message: "success",
        page: apiFeatures.page,
        resulte: products.length,
        products})
    }
)

export const getProduct = catchError(
    async(req,res,next)=> {
        const {id} = req.params
        const product = await productModel.findById(id)
        !product && next(new AppError("product not found", 404))
        product && res.status(201).json({message: "success", product})    }
)

export const updateProduct = catchError(
    async(req, res, next)=>{
        const {id} = req.params
        if(req.body.name) req.body.slug = slugify(req.body.name)
        const product = await productModel.findByIdAndUpdate(id, req.body, {new: true})
        !product && next(new AppError("product not found", 404))
        product && res.status(201).json({message: "success", product})
    }
)

export const deleteProduct = catchError(
    async(req, res, next)=>{
        const {id} = req.params
        const Product = await productModel.findByIdAndDelete(id)
        !Product && next(new AppError("product not found", 404))
        Product && res.status(201).json({message: "success"})
    }
)



