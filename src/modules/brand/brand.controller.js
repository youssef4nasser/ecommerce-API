import slugify from "slugify"
import { brandModel } from "../../../database/models/brand.model.js"
import { AppError } from "../../utils/AppError.js"
import { catchError } from "../../utils/catchError.js"
import { ApiFeatures } from "../../utils/ApiFeatures.js"
import cloudinary from "../../utils/cloudinary.js"

export const addBrand = catchError(
    async(req, res, next)=>{
        const brand = new brandModel(req.body)
        if(req.file){
            const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path,
                  {folder: `ecommerce/brand`})

            req.body.imgCover = {secure_url, public_id}
        }
        await brand.save()
        return res.status(201).json({message: "success", brand})
    }
)

export const getAllBrands = catchError(
    async(req, res, next)=>{
        let apiFeatures = new ApiFeatures(brandModel.find(), req.query)
        .paginate().fields().filter().sort().search()
        
        // exeute query
        const brands = await apiFeatures.mongooseQuery
        
        return res.status(201).json({ message: "success",
        pageNumber: apiFeatures.pageNumber,
        resulte: brands.length,
        brands})
    }
)

export const getBrand = catchError(
    async(req,res,next)=> {
        const {id} = req.params
        const brand = await brandModel.findById(id)
        return res.status(201).json({message: "success", brand})
    }
)

export const updateBrand = catchError(
    async(req, res, next)=>{
        const {id} = req.params
        req.body.slug = slugify(req.body.name)
        const brand = await brandModel.findByIdAndUpdate(id, req.body, {new: true})
        !brand && next(new AppError("brand not found", 404))
        brand && res.status(201).json({message: "success", brand})
    }
)

export const deleteBrand = catchError(
    async(req, res, next)=>{
        const {id} = req.params
        const brand = await brandModel.findByIdAndDelete(id)
        !brand && next(new AppError("brand not found", 404))
        brand && res.status(201).json({message: "success"})
    }
)
