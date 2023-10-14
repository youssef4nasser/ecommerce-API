import slugify from "slugify"
import { categoryModel } from "../../../database/models/category.model.js"
import { AppError } from "../../utils/AppError.js"
import { catchError } from "../../utils/catchError.js"
import { ApiFeatures } from "../../utils/ApiFeatures.js"

export const addCategory = catchError(
    async(req, res, next)=>{
        const category = new categoryModel(req.body)
        await category.save()
        return res.status(201).json({message: "success", category})
    }
)

export const getAllCategories = catchError(
    async(req, res, next)=>{
        let apiFeatures = new ApiFeatures(categoryModel.find(), req.query)
        .paginate().fields().filter().sort().search()
        
        // exeute query
        const categories = await apiFeatures.mongooseQuery
        
        return res.status(201).json({ message: "success",
        pageNumber: apiFeatures.pageNumber,
        resulte: categories.length,
        categories})
    }
)

export const getCategory = catchError (
    async(req,res,next)=> {
        const {id} = req.params
        const category = await categoryModel.findById(id)
        return res.status(201).json({message: "success", category})
    }
)

export const updateCategory = catchError(
    async(req, res, next)=>{
        const {id} = req.params
        if(req.body.name) req.body.slug = slugify(req.body.name)
        const category = await categoryModel.findByIdAndUpdate(id, req.body, {new: true})
    
        !category && next(new AppError("category not found", 404))
        category && res.status(201).json({message: "success", category})
    }
)

export const deleteCategory = catchError(
    async(req, res, next)=>{
        const {id} = req.params
        const category = await categoryModel.findByIdAndDelete(id)
        !category && next(new AppError("category not found", 404))
        category && res.status(201).json({message: "success"})
    }
)
