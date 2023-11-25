import { brandModel } from "../../../database/models/brand.model.js"
import { AppError } from "../../utils/AppError.js"
import { catchError } from "../../utils/catchError.js"
import { ApiFeatures } from "../../utils/ApiFeatures.js"
import cloudinary from "../../utils/cloudinary.js"

export const addBrand = catchError(
    async(req, res, next)=>{
        // check if name already exis or not when create brand
        const isExist = await brandModel.findOne({name: req.body.name})
        if (isExist) return next(new AppError(`The brand ${req.body.name} already exist`, 409));
        // uplaod image for brand
        if(req.file){
            const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path,
                  {folder: `ecommerce/brand`})

            req.body.imgCover = {secure_url, public_id}
        }
        // create brand
        const brand = new brandModel(req.body)
        await brand.save()
        return res.status(201).json({message: "success", brand})
    }
)

export const getAllBrands = catchError(
    async(req, res, next)=>{
        let apiFeatures = new ApiFeatures(brandModel.find({}), req.query)
        .paginate().fields().filter().sort().search()
        
        // exeute query
        const brands = await apiFeatures.mongooseQuery
        
        return res.status(200).json({ message: "success",
        page: apiFeatures.page,
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
        // check if name already exis or not when update brand
        const isExist = await brandModel.findOne({name: req.body.name})
        if (isExist) return next(new AppError(`The brand ${req.body.name} already exist`, 409));
        
        // uplaod image for brand
        if(req.file){
            const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path,
                    {folder: `ecommerce/brand`})
            req.body.imgCover = {secure_url, public_id}
        }

        // Destroy old image from Cloudinary
        const brand = await brandModel.findById(id);
        if (brand.imgCover && req.file) {
            await cloudinary.uploader.destroy(brand.imgCover.public_id)
        }

        const updateBrand = await brandModel.findByIdAndUpdate(id, req.body, {new: true})
        !updateBrand && next(new AppError("brand not found", 404))
        updateBrand && res.status(201).json({message: "success", brand: updateBrand})
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
