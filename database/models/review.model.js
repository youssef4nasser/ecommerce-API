import { Schema } from "mongoose";

const reviewSchema = new Schema({
    review: {
        type : String,
        required:[true,'review Name is Required'],
        unique: true,
        trim: true,
    },
    product: {
        type: Schema.ObjectId,
        ref:'product',
        required: true,
    },
    user:{
        type: Schema.ObjectId,
        ref:"user",
        required: true,
    },
    rating:{
        type: Number,
        enum: [1,2,3,4,5],
    }

},{
    timestamps: true
})

export const reviewModel = mongoose.model('review',reviewSchema)