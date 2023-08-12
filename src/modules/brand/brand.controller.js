import { brandModel } from "../../../database/models/brand.model.js"
import { addOne, deleteOne, getAll, updateOne } from "../handlers/factor.js"



export const addBrand = addOne(brandModel, "brand")
// catchError(
//     async(req, res, next)=>{
//         req.body.slug = slugify(req.body.name)
//         const brand = new brandModel(req.body)
//         await brand.save()
//         return res.status(201).json({message: "success", brand})
//     }
// )

export const getAllBrands = getAll(brandModel, "brands")
// catchError(
//     async(req, res, next)=>{
//         const brands = await brandModel.find()
//         return res.status(201).json({message: "success", brands})
//     }
// )

export const updateBrand = updateOne(brandModel, "brand")
// catchError(
//     async(req, res, next)=>{
//         const {id} = req.params
//         req.body.slug = slugify(req.body.name)
//         const brand = await brandModel.findByIdAndUpdate(id, req.body, {new: true})
//         !brand && next(new AppError("brand not found", 404))
//         brand && res.status(201).json({message: "success", brand})
//     }
// )

export const deleteBrand = deleteOne(brandModel, "brand")
