import { userModel } from "../../../DataBase/models/user.model.js";
import { productModel } from "../../../DataBase/models/product.model.js";
import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";

export const addToWishlist = catchError(
    async(req, res, next)=>{
        const {product} = req.body
        // check product
        const productId = await productModel.findById(product)
        if(!productId) next(new AppError("Product not found", 401)) 
        // add product to wishlist
        const userWishlist = await userModel.findByIdAndUpdate(req.user.id, {$addToSet: {wishlist: product}}, {new: true})
        !userWishlist && next(new AppError("Not found", 409))
        userWishlist && res.status(200).json({message: "Success", wishlist:userWishlist.wishlist})
    }
)

export const removeFromWishlist = catchError(
    async(req, res, next)=>{
        const {product} = req.body
        // check product
        const productId = await productModel.findById(product)
        if(!productId) next(new AppError("Product not found", 401)) 
        // delete product in wishlist
        const userWishlist = await userModel.findByIdAndUpdate(req.user.id, {$pull: {wishlist: product}}, {new: true})
        !userWishlist && next(new AppError("Not found", 409))
        userWishlist && res.status(200).json({message: "Success", wishlist:userWishlist.wishlist})
    }
)

export const getUserWishlist = catchError(
    async (req, res, next)=>{
        const userWishlist =  await userModel.findById(req.user.id).populate("wishlist")
        return res.status(200).json({message: "Success", wishlist:userWishlist.wishlist})
    }
)
