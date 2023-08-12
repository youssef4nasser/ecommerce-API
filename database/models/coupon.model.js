import { Schema } from "mongoose";

const couponSchema = new Schema({
    code: {
        type : String,
        required:[true,'coupon Name is Required'],
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

},{
    timestamps: true
})

export const couponModel = mongoose.model('coupon',couponSchema)