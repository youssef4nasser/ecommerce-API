import { json } from "express"
import { productModel } from "../../../database/models/product.model.js"
import { AppError } from "../../utils/AppError.js"
import { catchError } from "../../utils/catchError.js"
import slugify from "slugify"

export const addProduct = catchError(
    async(req, res, next)=>{
        req.body.slug = slugify(req.body.title)
        const product = new productModel(req.body)
        await product.save()
        return res.status(201).json({message: "success", product})
    }
)

export const getAllProducts = catchError(
    async(req, res, next)=>{
        const PAGE_LIMIT = 5
        let PAGE_NUMBER = req.query.page * 1 || 1
        if(PAGE_NUMBER <= 0) PAGE_NUMBER = 1
        const SKIP = (PAGE_NUMBER - 1) * PAGE_LIMIT

        // Filter
        const filterObj = req.query
        let excludedQuery = ['page', 'sort', 'fields', 'keyword']
        excludedQuery.forEach((q)=>{
            delete filterObj[q]
        })

        filterObj = JSON.stringify(filterObj)
        filterObj = filterObj.replace(/\b(gt|gte|lt|lte)\b/g, match=>`$${match}`)
        filterObj = JSON.parse(filterObj)

        const products = await productModel.find(filterObj).skip(SKIP).limit(PAGE_LIMIT)
        return res.status(201).json({ message: "success", page: PAGE_NUMBER, products,})
    }
)

export const updateProduct = catchError(
    async(req, res, next)=>{
        const {id} = req.params
        if(req.body.title) req.body.slug = slugify(req.body.title)
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
