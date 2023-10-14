import mongoose, { Schema, model } from "mongoose";
import slugify from "slugify";
import { AppError } from "../../src/utils/AppError.js";

const brandSchema = new Schema({
    name: {
        type : String,
        required:[true,'brand Name is Required'],
        unique: true,
        trim: true,
        maxlength: [100,"Name should be less than 100 characters"],
    },
    slug: {
        type :String,
        lowercase: true,
    },
    imgCover:{
        secure_url: String,
        public_id: String
    }
},{
    timestamps: true
})

// check if name already exis or not when create brand
brandSchema.pre('save', async function(next) {
    const isExest = await mongoose.models["Brand"].findOne({name : this.name})
    if (isExest) return next(new AppError(`The ${this.name} already exist`, 409));
       next();
})
// slug name
brandSchema.pre('save', function(){
    this.slug = slugify(this.name)
})
// check if name already exis or not when update brand
brandSchema.pre('findOneAndUpdate', async function(next){
    const duplicate = await this.model.findOne({ name: this._update.name });
    if(duplicate){
        return next(new AppError(`The ${this._update.name} already exist`, 409));
    }
    next();
})


export const brandModel = model('Brand', brandSchema)