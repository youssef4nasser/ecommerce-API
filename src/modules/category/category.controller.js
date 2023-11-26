import { categoryModel } from "../../../DataBase/models/category.model.js";
import { ApiFeatures } from "../../utils/ApiFeature.js";
import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";
import cloudinary from "../../utils/cloudinary.js";

export const addCategory = catchError(
    async (req, res, next)=>{
        // check if Category already exist or no
        const isExist = await categoryModel.findOne({name: req.body.name})
        if(isExist) return next(new AppError("This Category already exist", 409))
        // upload image
        const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path,
              {folder: `${process.env.FLODER_NAME}/Category`})
        req.body.image = {secure_url, public_id}
        // create new category and save on DB
        const category = new categoryModel(req.body)
        await category.save()
        res.status(201).json({message: "Success", category})
    }
)

export const getAllCategories = catchError(
    async (req, res, next)=>{
        let apiFeatures = new ApiFeatures(categoryModel.find({}), req.query)
        .paginate().filter().select().search().sort()
        // execute query
        const category = await apiFeatures.mongooseQuery
        return res.status(200).json({message: "Success",
        page: apiFeatures.page,
        resulte: category.length,
        category})
    }
)

export const getCategory = catchError(
    async(req, res, next)=>{
        const {id} = req.params
        const category = await categoryModel.findById(id)
        !category && next(new AppError("Not found this Category", 409))
        category && res.status(200).json({message: "Success", category})
    }
)

export const updateCategory = catchError(
    async(req, res, next)=>{
        const {id} = req.params
        // get category by id
        let category = await categoryModel.findById(id)
        // check this category found or no
        !category && next(new AppError("Not found this Category", 409))
        // check if category name already exist
        const isExist = await categoryModel.findOne({name: req.body.name})
        if(isExist) return next(new AppError("This Category already exist", 409))
        // update name
        if(req.body.name){
            category.name = req.body.name
        }
        // update image
        if(req.file){
            // delete old image in Cloudinar
            await cloudinary.uploader.destroy(category.image.public_id)
            // upload new image to Cloudinar
            const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path,
                  {folder: `${process.env.FLODER_NAME}/Category`})
                  category.image = {secure_url, public_id}
        }
        await category.save()
        category && res.status(200).json({message: "Success", category})
    }
)

export const deleteCategory = catchError(
    async(req, res, next)=>{
        const {id} = req.params
        let category = await categoryModel.findByIdAndDelete(id)
        !category && next(new AppError("Not found this Category", 409))
        // delete image in Cloudinar
        await cloudinary.uploader.destroy(category.image.public_id)
        category && res.status(200).json({message: "Success"})
    }
)