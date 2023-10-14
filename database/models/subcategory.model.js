import mongoose, { Schema, model } from "mongoose";
import { AppError } from "../../src/utils/AppError.js";
import slugify from "slugify";

const subCategorySchema = new Schema({
    name: {
        type : String,
        required:[true,'subCategory Name is Required'],
        unique: true,
        trim: true,
        maxlength: [100,"Name should be less than 100 characters"],
    },
    slug: {
        type :String,
        lowercase: true,
    },
    imgCover:{
        type: String,
    },
    category:{
        type: Schema.ObjectId,
        ref :"category",
        required: true,
    },
},{
    timestamps: true
})

subCategorySchema.pre('save', async function(next) {
    const isExest = await mongoose.models["SubCategory"].findOne({name : this.name})
    if (isExest) return next(new AppError(`${this.name} already exist`, 409));
       next();
})

subCategorySchema.pre('save', function(){
    this.slug = slugify(this.name)
})

// check if name already exis or not when update subCategory
subCategorySchema.pre('findOneAndUpdate', async function(next){
    const duplicate = await this.model.findOne({ name: this._update.name });
    if(duplicate){
        return next(new AppError(`The ${this._update.name} already exist`, 409));
    }
    next();
})

export const subCategoryModel = model('SubCategory', subCategorySchema)