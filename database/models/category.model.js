import mongoose from "mongoose";
import { Schema,model } from "mongoose";
import slugify from "slugify";
import { AppError } from "../../src/utils/AppError.js";

const categorySchema = new Schema({
    name: {
        type : String,
        required:[true, 'Category Name is Required'],
        unique: true,
        trim: true,
        maxlength: [200,"Name should be less than 200 characters"],
    },
    slug: {
        type :String,
        lowercase: true,
    },
    imgCover: {
        type: String,
    }
},{
    timestamps: true
})

categorySchema.pre('save', async function(next) {
    const isExest = await mongoose.models["Category"].findOne({name : this.name})
    if (isExest) return next(new AppError(`${this.name} already exist`, 409));
       next();
})

categorySchema.pre('save', function(){
    this.slug = slugify(this.name)
})

// check if name already exis or not when update Category
categorySchema.pre('findOneAndUpdate', async function(next){
    const duplicate = await this.model.findOne({ name: this._update.name });
    if(duplicate){
        return next(new AppError(`The ${this._update.name} already exist`, 409));
    }
    next();
})

export const categoryModel = model('Category', categorySchema)