import { Schema, model } from "mongoose";

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

export default model("Coupon", couponSchema);
