import { brandModel } from "../../../DataBase/models/brand.model.js";
import { categoryModel } from "../../../DataBase/models/category.model.js";
import { productModel } from "../../../DataBase/models/product.model.js";
import { subCategoryModel } from "../../../DataBase/models/subcategory.model.js";
import { ApiFeatures } from "../../utils/ApiFeature.js";
import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";
import cloudinary from "../../utils/cloudinary.js";

export const addProduct = catchError(
    async (req, res, next)=>{
        // check if name Product already exist or no
        const isExist = await productModel.findOne({name: req.body.name})
        if(isExist) return next(new AppError("This Product already exist", 409))
        // Check the brand
        const brand = await brandModel.findById(req.body.brand)
        if(!brand) return next(new AppError('The brand does not exist', 404));
        // Check the Category
        const category = await categoryModel.findById(req.body.category)
        if(!category) return next(new AppError('The Category does not exist', 404));
        // Check the subCategory
        const subCategory = await subCategoryModel.findById(req.body.subCategory)
        if(!subCategory) return next(new AppError('The SubCategory does not exist', 404));

        // upload main image
        const {secure_url, public_id} = await cloudinary.uploader.upload(req.files.image[0].path,
              {folder: `${process.env.FLODER_NAME}/Products`})
        req.body.image = {secure_url, public_id}

        if(req.files.images){
            let images=[];
            for (const file of req.files.images) {
                const {secure_url, public_id} = await cloudinary.uploader.upload(file.path,
                    {folder: `${process.env.FLODER_NAME}/Products/ProductsImages`});
                    images.push({secure_url, public_id});  
            }
            req.body.images=images;
        }
        req.body.colors = JSON.parse(req.body.colors)
        req.body.sizes = JSON.parse(req.body.sizes)
        // create new Product and save on DB
        const product = new productModel(req.body)
        await product.save()
        res.status(201).json({message: "Success", product})
    }
)

export const getAllProducts = catchError(
    async (req, res, next)=>{
        let apiFeatures = new ApiFeatures(productModel.find({}), req.query)
        .paginate().filter().select().search().sort()
        // execute query
        const products = await apiFeatures.mongooseQuery.populate([
            {
                path: 'brand',
                select: '-images -image'
            },
            {
                path: 'category',
                select: '-images -image'
            },
            {
                path: 'subCategory',
                select: '-images -image'
            },
        ]);
        return res.status(200).json({message: "Success",
        page: apiFeatures.page,
        resulte: products.length,
        products})
    }
)

export const getProduct = catchError(
    async(req, res, next)=>{
        const {id} = req.params
        const product = await productModel.findById(id)
        !product && next(new AppError("Not found this Product", 409))
        product && res.status(200).json({message: "Success", product})
    }
)

export const updateProduct = catchError(
    async (req, res, next)=>{
        // find productId
        const {id} = req.params
        const product = await productModel.findById(id)
        !product && next(new AppError("Not found this Product", 409))
        // if update name
        if (req.body.name) {
            // check if name Product already exist or no
            const isExist = await productModel.findOne({name: req.body.name})
            if(isExist) return next(new AppError("This Product already exist", 409))
        }
        // if update brand
        if(req.body.brand){
            // Check the brand
            const brand = await brandModel.findById(req.body.brand)
            if(!brand) return next(new AppError('The brand does not exist', 404));
        }
        // if update Category
        if(req.body.category){
            // Check the Category
            const category = await categoryModel.findById(req.body.category)
            if(!category) return next(new AppError('The Category does not exist', 404));
        }
        // if update subCategory
        if(req.body.subCategory){
            // Check the subCategory
            const subCategory = await subCategoryModel.findById(req.body.subCategory)
            if(!subCategory) return next(new AppError('The SubCategory does not exist', 404));
        }
        if(req.files){
            // update main image
            if(req.files?.image?.length){
                const {secure_url, public_id} = await cloudinary.uploader.upload(req.files.image[0].path,
                    {folder: `${process.env.FLODER_NAME}/Products`})
                // delete old image in Cloudinar
                await cloudinary.uploader.destroy(product.image.public_id)
                req.body.image = {secure_url, public_id}
            }
            // update cover images
            if(req.files?.images?.length){
                let images=[];
                for (const file of req.files.images) {
                    const {secure_url, public_id} = await cloudinary.uploader.upload(file.path,
                        {folder: `${process.env.FLODER_NAME}/Products/ProductsImages`});
                        images.push({secure_url, public_id});  
                }
                // delete all images in Cloudinar
                product.images.map((image)=>{
                    cloudinary.uploader.destroy(image.public_id);
                })
                req.body.images=images;
            }
        }
        // JSON.parse
        if(req.body.colors){
            req.body.colors = JSON.parse(req.body.colors)
        }
        if(req.body.sizes){
            req.body.sizes = JSON.parse(req.body.sizes)
        }
        // update Product and save on DB
        const updatedProduct = await productModel.findByIdAndUpdate(product._id, req.body, {new: true})
        return res.status(201).json({message: "Success", product:updatedProduct})
    }
)

export const deleteProduct = catchError(
    async(req, res, next)=>{
        const {id} = req.params
        let product = await productModel.findByIdAndDelete(id)
        !product && next(new AppError("Not found this product", 409))
        // delete image in Cloudinar
        await cloudinary.uploader.destroy(product.image.public_id)
        // delete all images in Cloudinar
        product.images.map((image)=>{
            cloudinary.uploader.destroy(image.public_id);
        })
        product && res.status(200).json({message: "Success"})
    }
)