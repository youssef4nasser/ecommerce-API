import { reviewModel } from "../../../database/models/review.model.js"
import { ApiFeatures } from "../../utils/ApiFeatures.js"
import { AppError } from "../../utils/AppError.js"
import { catchError } from "../../utils/catchError.js"

export const addReview = catchError(
    async (req, res, next)=>{
        req.body.user = req.user._id
        // check if user created review before or not on the product
        const isReview = await reviewModel.findOne({user: req.user._id, product: req.body.product})
        if(isReview) return next(new AppError(`You created a review before`, 409));
        // create new review and save it to database
        const review = await reviewModel(req.body)
        await review.save()
        return res.status(201).json({message: "success", review})
    }
)

export const getAllReviews = catchError(
    async(req, res, next)=>{
        let apiFeatures = new ApiFeatures(reviewModel.find().populate("user", "name"), req.query)
        .paginate().fields().filter().sort().search()
        
        // exeute query
        const reviews = await apiFeatures.mongooseQuery
        
        return res.status(201).json({ message: "success",
        pageNumber: apiFeatures.pageNumber,
        resulte: reviews.length,
        reviews})
    }
)

export const getReview = catchError(
    async(req,res,next)=> {
        const {id} = req.params
        const review = await reviewModel.findById(id).populate("user", "name")
        !review && next(new AppError("review not found", 404))
        review && res.status(201).json({message: "success", review})
    }
)

export const updateReview = catchError(
    async(req, res, next)=>{
        const {id} = req.params
        const review = await reviewModel.findOneAndUpdate({_id: id, user: req.user.id}, req.body, {new: true})
        !review && next(new AppError(`Review not found or you are not authorized to perform this action`, 404))
        review && res.status(201).json({message: "success", review})
    }
)

export const deleteReview = catchError(
    async(req, res, next)=>{
        const {id} = req.params
        const review = await reviewModel.findByIdAndDelete(id)
        !review && next(new AppError("review not found", 404))
        review && res.status(201).json({message: "success"})
    }
)
