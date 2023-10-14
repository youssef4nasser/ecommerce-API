import mongoose, { Schema, model } from "mongoose";
import bcrypt from 'bcrypt'
import { AppError } from "../../src/utils/AppError.js";

const userSchema = new Schema({
    name: {
        type : String,
        required: true,
        trim: true,
        maxlength: [50, "Name should be less than 50 characters"],
    },
    email: {
        type:String,
        unique: true,
        required: true,
        trim: true,
    },
    password:{
        type:String,
        minlength:[6, 'Password must have atleast 6 character'],
        required: true
    },
    role:{
        type: String,
        enum: ['admin', 'user'],
        default:'user'
    },
    isActive:{
        type:Boolean,
        default:true
    },
    isVerified:{
        type: Boolean,
        default:false
    },
    codeConfirmEmail:{
        type: String,
        minlength:[6, 'minlength must be 6'],
        maxlength:[6, 'maxlength must be 6'],
    },
    blocked: {
        type: Boolean,
        default: false
    },
    passwordChangeAt: Date,
    wishlist: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Product'
    }],
    address: [{
        city: String,
        street: String,
        phone: String
    }],
},{
    timestamps: true
})

// check if user is exist or not
userSchema.pre('save', async function(next) {
    const isExest = await mongoose.models["User"].findOne({email : this.email})
    if (isExest) return next(new AppError(`${this.email} already exist`, 409));
       next();
})

// Hashing the Password before saving it to DB
userSchema.pre('save', function(){
    this.password = bcrypt.hashSync(this.password, Number(process.env.SALT_ROUND))
})

// Hashing a new Password after update old password
userSchema.pre('findOneAndUpdate', function(){
    if(this._update.password) this._update.password = bcrypt.hashSync(this._update.password, Number(process.env.SALT_ROUND))
})

export const userModel = model('User', userSchema)
