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

categorySchema.pre('save', function(){
    this.slug = slugify(this.name)
})

// check if name already exis or not when update Category
categorySchema.pre('findOneAndUpdate', async function(next){
    if(this._update.name){
        this._update.slug = slugify(this._update.name);
    }
})

export const categoryModel = model('Category', categorySchema)