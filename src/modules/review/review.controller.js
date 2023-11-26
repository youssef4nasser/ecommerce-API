import { reviewModel } from "../../../DataBase/models/review.model.js";
import { productModel } from "../../../DataBase/models/product.model.js";
import { orderModel } from "../../../DataBase/models/order.model.js";
import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";
import { ApiFeatures } from "../../utils/ApiFeature.js";

export const addReview = catchError(
    async (req, res, next)=>{
        // user only buy product can add review
        const isOrder = await orderModel.findOne({user: req.user.id, isDelivered: true})
        if(!isOrder) return next(new AppError("You must be a buyer to write reviews", 401))
        // Check product
        const product = await productModel.findById(req.body.product)
        if(!product) return next(new AppError('Product not found', 401));
        // Check if user add review before on product
        const isReview = await reviewModel.findOne({user: req.user.id, produt: req.body.produt})
        if(isReview) return next(new AppError('You already left a review for this product', 409))
        // create new review and save on DB
        req.body.user = req.user.id
        const review = new reviewModel(req.body)
        await review.save()
        res.status(201).json({message: "Success", review})
    }
)

export const getAllReviews = catchError(
    async (req, res, next)=>{
        let apiFeatures = new ApiFeatures(reviewModel.find({}), req.query)
        .paginate().filter().select().search().sort()
        // execute query
        const reviews = await apiFeatures.mongooseQuery.populate("product")
        return res.status(200).json({message: "Success",
        page: apiFeatures.page,
        resulte: reviews.length,
        reviews})
    }
)

export const getReview = catchError(
    async(req, res, next)=>{
        const {id} = req.params
        const review = await reviewModel.findById(id)
        !review && next(new AppError("Not found this Review", 409))
        review && res.status(200).json({message: "Success", review})
    }
)

export const updateReview = catchError(
    async(req, res, next)=>{
        const {id} = req.params
        // get review by id
        let review = await reviewModel.findOneAndUpdate({_id: id, user: req.user.id}, req.body, {new: true})
        // check this review found or no
        !review && next(new AppError("Not found this Review or you are not authorize", 409))
        review && res.status(200).json({message: "Success", review})
    }
)

export const deleteReview = catchError(
    async(req, res, next)=>{
        const {id} = req.params
        let review = await reviewModel.findByIdAndDelete(id)
        !review && next(new AppError("Not found this Review", 409))
        review && res.status(200).json({message: "Success"})
    }
)