import { subCategoryModel } from "../../../database/models/subCategory.model.js"
import { addOne, deleteOne, getAll, getOne, updateOne } from "../handlers/factor.js"



export const addSubCategory = addOne(subCategoryModel, "subCategory")
// catchError(
//     async(req, res, next)=>{
//         req.body.slug = slugify(req.body.name)
//         const subCategory = new subCategoryModel(req.body)
//         await subCategory.save()
//         return res.status(201).json({message: "success", subCategory})
//     }
// )

export const getSubCategory = getOne(subCategoryModel, "subCategory")
// catchError (
//     async(req,res,next)=> {
//         const {id} = req.params
//         const category = await subCategoryModel.findById(id)
//         return res.status(201).json({message: "success", category})
//     }
// )

export const getAllSubCategories = getAll(subCategoryModel, "subCategories")
// catchError(
//     async(req, res, next)=>{
//         const subCategories = await subCategoryModel.find()
//         return res.status(201).json({message: "success", subCategories})
//     }
// )

export const updateSubCategory = updateOne(subCategoryModel, "subCategory")
// catchError(
//     async(req, res, next)=>{
//         const {id} = req.params
//         if(req.body.name) req.body.slug = slugify(req.body.name)
//         const subCategory = await subCategoryModel.findByIdAndUpdate(id, req.body, {new: true})
//         !subCategory && next(new AppError("subCategory not found", 404))
//         subCategory && res.status(201).json({message: "success", subCategory})
//     }
// )

export const deleteSubCategory = deleteOne(subCategoryModel, "subCategory")
// catchError(
//     async(req, res, next)=>{
//         const {id} = req.params
//         const subCategory = await subCategoryModel.findByIdAndDelete(id)
//         !subCategory && next(new AppError("subCategory not found", 404))
//         subCategory && res.status(201).json({message: "success"})
//     }
// )

