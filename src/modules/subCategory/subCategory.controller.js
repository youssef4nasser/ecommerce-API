import slugify from "slugify"
import { subCategoryModel } from "../../../database/models/subcategory.model.js"
import { catchError } from "../../utils/catchError.js"
import { addOne, deleteOne, getAll, getOne, updateOne } from "../handlers/factor.js"
import { AppError } from "../../utils/AppError.js"
import { ApiFeatures } from "../../utils/ApiFeatures.js"

export const addSubCategory = catchError(
    async(req, res, next)=>{
        const subCategory = new subCategoryModel(req.body)
        await subCategory.save()
        return res.status(201).json({message: "success", subCategory})
    }
)

export const getSubCategory = catchError (
    async(req,res,next)=> {
        const {id} = req.params
        const category = await subCategoryModel.findById(id)
        return res.status(201).json({message: "success", category})
    }
)

export const getAllSubCategories = catchError(
    async(req, res, next)=>{
        let apiFeatures = new ApiFeatures(subCategoryModel.find(), req.query)
        .paginate().fields().filter().sort().search()
        
        // exeute query
        const subCategories = await apiFeatures.mongooseQuery
        
        return res.status(201).json({ message: "success",
        pageNumber: apiFeatures.pageNumber,
        resulte: subCategories.length,
        subCategories})
    }
)

export const updateSubCategory = catchError(
    async(req, res, next)=>{
        const {id} = req.params
        if(req.body.name) req.body.slug = slugify(req.body.name)
        const subCategory = await subCategoryModel.findByIdAndUpdate(id, req.body, {new: true})
        !subCategory && next(new AppError("subCategory not found", 404))
        subCategory && res.status(201).json({message: "success", subCategory})
    }
)

export const deleteSubCategory = catchError(
    async(req, res, next)=>{
        const {id} = req.params
        const subCategory = await subCategoryModel.findByIdAndDelete(id)
        !subCategory && next(new AppError("subCategory not found", 404))
        subCategory && res.status(201).json({message: "success"})
    }
)
