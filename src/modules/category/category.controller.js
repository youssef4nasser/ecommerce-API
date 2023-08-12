import { categoryModel } from "../../../database/models/category.model.js"
import { addOne, deleteOne, getAll, getOne, updateOne } from "../handlers/factor.js"



export const addCategory = addOne(categoryModel, "category")
// catchError(
//     async(req, res, next)=>{
//         req.body.slug = slugify(req.body.name)
//         const category = new categoryModel(req.body)
//         await category.save()
//         return res.status(201).json({message: "success", category})
//     }
// )

export const getAllCategories = getAll(categoryModel, "categories")
// catchError(
//     async(req, res, next)=>{
//         const categories = await categoryModel.find()
//         return res.status(201).json({message: "success", categories})
//     }
// )

export const getCategory = getOne(categoryModel, "category")
// catchError (
//     async(req,res,next)=> {
//         const {id} = req.params
//         const category = await categoryModel.findById(id)
//         return res.status(201).json({message: "success", category})
//     }
// )

export const updateCategory = updateOne(categoryModel, "category")
// catchError(
//     async(req, res, next)=>{
//         const {id} = req.params
//         req.body.slug = slugify(req.body.name)
//         const category = await categoryModel.findByIdAndUpdate(id, req.body, {new: true})
//         !category && next(new AppError("category not found", 404))
//         category && res.status(201).json({message: "success", category})
//     }
// )

export const deleteCategory = deleteOne(categoryModel, "category")
// catchError(
//     async(req, res, next)=>{
//         const {id} = req.params
//         const category = await categoryModel.findByIdAndDelete(id)
//         !category && next(new AppError("category not found", 404))
//         category && res.status(201).json({message: "success"})
//     }
// )
