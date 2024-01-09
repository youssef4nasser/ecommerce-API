import mongoose, { Schema, model } from "mongoose";
import bcrypt from 'bcrypt'

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
    expireDateCode: Date,
    wishlist: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Product'
    }],
    address: [{
        city: String,
        street: String,
        phone: String
    }],
    provider:{
        type: String,
        enum: ['google', 'facebook', 'systeme'],
        default:'systeme'
    },
    profileImage:{
        type: String,
    }
},{
    timestamps: true
})

// Hashing the Password before saving it to DB
userSchema.pre('save', function(){
    this.password = bcrypt.hashSync(this.password, Number(process.env.SALT_ROUND))
})

// Hashing a new Password after update old password
userSchema.pre('findOneAndUpdate', function(){
    if(this._update.password) this._update.password = bcrypt.hashSync(this._update.password, Number(process.env.SALT_ROUND))
})

export default model('User', userSchema)