import { Schema, model } from "mongoose";

const brandSchema = new Schema({
    name: {
        type : String,
        required:[true,'brand Name is Required'],
        unique: true,
        trim: true,
        maxlength: [50,"Name should be less than 50 characters"],
    },
    slug: {
        type :String,
        lowercase: true,
    },
    logo: {
        type :String,
    }
},{
    timestamps: true
})

export const brandModel = model('brand',brandSchema)