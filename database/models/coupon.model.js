import mongoose, { Schema, model } from "mongoose";
import { AppError } from "../../src/utils/AppError.js";

const couponSchema = new Schema({
    code: {
        type : String,
        required:[true,'coupon code is Required'],
        unique: true,
        trim: true,
    },
    expires: {
        type: Date,
        required: true,
    },
    discount:{
        type: Number,
        required: true,
        min: 0,
    },
    usedBy: {
        type: Schema.ObjectId,
        ref: 'User'
    }
},{
    timestamps: true
})

couponSchema.pre('save', async function(next) {
    const isExest = await mongoose.models["Coupon"].findOne({code : this.code})
    if (isExest) return next(new AppError(`Coupon ${this.code} already exist`, 409));
       next();
})

export const couponModel = model('Coupon', couponSchema)