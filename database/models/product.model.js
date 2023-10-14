import mongoose, { Schema,model } from "mongoose";
import slugify from "slugify";
import { AppError } from "../../src/utils/AppError.js";

const productSchema = new Schema({
    name: {
        type : String,
        required:[true, 'product Name is Required'],
        unique: true,
        trim: true,
        minlength:[3, "Name should be more than 3 characters"],
    },
    slug: {
        type :String,
        lowercase: true,
    },
    price: {
        type : Number,
        default:0,
        min: 0
    },
    description: {
        type : String,
        maxlength: [250, "description should be less than 250 characters"],
        minlength:[3, "description should be more than 3 characters"],
        required: true,
        trim: true,
    },
    stock: {
        type :Number,
        default:0,
        min: 0
    },
    sold: {
        type :Number,
        default:0,
        min: 0
    },
    category: {
        type: Schema.ObjectId,
        ref :"category",
        required: true,
    },
    subCategory: {
        type: Schema.ObjectId,
        ref :"subCategory",
        required: true,
    },
    brand: {
        type: Schema.ObjectId,
        ref :"brand",
        required: true,
    },
    ratingAvg: {
        type: Number,
        max:5,
        min:1
    },
    ratingCount: {
        type: Number,
        min: 0
    },
    imgCover:{
        type: String,
    },
    images: {
        type: [String],
    },
    priceAfterDiscount: {
        type: Number,
        default:0,
        min: 0
    }
},{
    timestamps: true,
    toJSON: {virtuals: true}
})

productSchema.pre('save', async function(next) {
    const isExest = await mongoose.models["Product"].findOne({name : this.name})
    if (isExest) return next(new AppError(`${this.name} already exist`, 409));
       next();
})
// slug name
productSchema.pre('save', function(){
    this.slug = slugify(this.name)
})
// virtual field reviews
productSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product'
})
// populate on virtual field reviews
productSchema.pre(['find', 'findOne'], function(){
    this.populate('reviews')
})
// check if name already exis or not when update product
productSchema.pre('findOneAndUpdate', async function(next){
    const duplicate = await this.model.findOne({ name: this._update.name });
    if(duplicate){
        return next(new AppError(`The ${this._update.name} already exist`, 409));
    }
    next();
})

export const productModel = model('Product', productSchema)