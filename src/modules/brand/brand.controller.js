import { brandModel } from "../../../DataBase/models/brand.model.js";
import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";
import cloudinary from "../../utils/cloudinary.js";
import { ApiFeatures } from "../../utils/ApiFeature.js";

export const addBrand = catchError(
    async (req, res, next)=>{
        // check if Brand already exist or no
        const isExist = await brandModel.findOne({name: req.body.name})
        if(isExist) return next(new AppError("This Brand already exist", 409))
        // upload image
        const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path,
              {folder: `${process.env.FLODER_NAME}/brand`})
        req.body.image = {secure_url, public_id}
        // create new brand and save on DB
        const brand = new brandModel(req.body)
        await brand.save()
        res.status(201).json({message: "Success", brand})
    }
)

export const getAllBrands = catchError(
    async (req, res, next)=>{
        let apiFeatures = new ApiFeatures(brandModel.find({}), req.query)
        .paginate().filter().select().search().sort()
        // execute query
        const brands = await apiFeatures.mongooseQuery;
        return res.status(200).json({message: "Success",
        page: apiFeatures.page,
        resulte: brands.length,
        brands})
    }
)

export const getBrand = catchError(
    async(req, res, next)=>{
        const {id} = req.params
        const brand = await brandModel.findById(id)
        !brand && next(new AppError("Not found this Brand", 409))
        brand && res.status(200).json({message: "Success", brand})
    }
)

export const updateBrand = catchError(
    async(req, res, next)=>{
        const {id} = req.params
        // get brand by id
        let brand = await brandModel.findById(id)
        // check this brand found or no
        !brand && next(new AppError("Not found this Brand", 409))
        // check if brand name already exist
        const isExist = await brandModel.findOne({name: req.body.name})
        if(isExist) return next(new AppError("This Brand already exist", 409))
        // update name
        if(req.body.name){
            brand.name = req.body.name
        }
        // update image
        if(req.file){
            // delete old image in Cloudinar
            await cloudinary.uploader.destroy(brand.image.public_id)
            // upload new image to Cloudinar
            const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path,
                  {folder: `${process.env.FLODER_NAME}/brand`})
                  brand.image = {secure_url, public_id}
        }
        await brand.save()
        brand && res.status(200).json({message: "Success", brand})
    }
)

export const deleteBrand = catchError(
    async(req, res, next)=>{
        const {id} = req.params
        let brand = await brandModel.findByIdAndDelete(id)
        !brand && next(new AppError("Not found this Brand", 409))
        // delete image in Cloudinar
        await cloudinary.uploader.destroy(brand.image.public_id)
        brand && res.status(200).json({message: "Success"})
    }
)