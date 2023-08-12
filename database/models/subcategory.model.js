import { Schema, model } from "mongoose";

const subCategorySchema = new Schema({
    name: {
        type : String,
        required:[true,'subCategory Name is Required'],
        unique: true,
        trim: true,
        maxlength: [50,"Name should be less than 50 characters"],
        minlength:[3,"Name should be more than 3 characters"],
    },
    slug: {
        type :String,
        lowercase: true,
    },
    category:{
        type: Schema.ObjectId,
        ref :"category",
        required: true,
    },
},{
    timestamps: true
})

export const subCategoryModel = model('subCategory',subCategorySchema)