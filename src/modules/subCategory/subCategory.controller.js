import { categoryModel } from "../../../DataBase/models/category.model.js";
import { subCategoryModel } from "../../../DataBase/models/subcategory.model.js";
import { ApiFeatures } from "../../utils/ApiFeature.js";
import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";
import cloudinary from "../../utils/cloudinary.js";

export const addSubCategory = catchError(
    async (req, res, next)=>{
        // check if subCategory already exist or no
        const isExist = await subCategoryModel.findOne({name: req.body.name})
        if(isExist) return next(new AppError("This SubCategory already exist", 409))
        // Check if the Category exists
        const category = await categoryModel.findById(req.body.category)
        if(!category) return next(new AppError('The Category does not exist', 404));
        // upload image
        const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path,
              {folder: `${process.env.FLODER_NAME}/SubCategory`})
        req.body.image = {secure_url, public_id}
        // create new subcategory and save on DB
        const subCategory = new subCategoryModel(req.body)
        await subCategory.save()
        res.status(201).json({message: "Success", subCategory})
    }
)

export const getAllSubCategories = catchError(
    async (req, res, next)=>{
        let filter = {}
        if(req.params.categoryId){
            filter = {category: req.params.categoryId}
        }
        let apiFeatures = new ApiFeatures(subCategoryModel.find(filter), req.query)
        .paginate().filter().select().search().sort()
        // execute query
        const subCategory = await apiFeatures.mongooseQuery.populate("category")
        return res.status(200).json({message: "Success",
        page: apiFeatures.page,
        resulte: subCategory.length,
        subCategory})
    }
)

export const getSubCategory = catchError(
    async(req, res, next)=>{
        const {id} = req.params
        const subCategory = await subCategoryModel.findById(id)
        !subCategory && next(new AppError("Not found this subCategory", 409))
        subCategory && res.status(200).json({message: "Success", subCategory})
    }
)

export const updateSubCategory = catchError(
    async(req, res, next)=>{
        const {id} = req.params
        // get subCategory by id
        let subCategory = await subCategoryModel.findById(id)
        // check this subCategory found or no
        !subCategory && next(new AppError("Not found this SubCategory", 409))
        // if update category id
        if(req.body.category){
            // Check if the Category exists
            const categoryId = await categoryModel.findById(req.body.category)
            if(!categoryId) return next(new AppError('The Category does not exist', 404));
        }
        // update name
        if(req.body.name){
            // check if subCategory name already exist
            const isExist = await subCategoryModel.findOne({name: req.body.name})
            if(isExist) return next(new AppError("This SubCategory already exist", 409))
            subCategory.name = req.body.name
        }
        // update image
        if(req.file){
            // delete old image in Cloudinar
            await cloudinary.uploader.destroy(subCategory.image.public_id)
            // upload new image to Cloudinar
            const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path,
                  {folder: `${process.env.FLODER_NAME}/SubCategory`})
                  subCategory.image = {secure_url, public_id}
        }
        await subCategory.save()
        subCategory && res.status(200).json({message: "Success", subCategory})
    }
)

export const deleteSubCategory = catchError(
    async(req, res, next)=>{
        const {id} = req.params
        let subCategory = await subCategoryModel.findByIdAndDelete(id)
        !subCategory && next(new AppError("Not found this SubCategory", 409))
        // delete image in Cloudinar
        await cloudinary.uploader.destroy(subCategory.image.public_id)
        subCategory && res.status(200).json({message: "Success"})
    }
)