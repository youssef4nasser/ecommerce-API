import { Schema } from "mongoose";

const userSchema = new Schema({
    name: {
        type : String,
        required: true,
        trim: true,
        maxlength: [50,"Name should be less than 50 characters"],
    },
    email: {
        type:String,
        unique: true,
        required: true,
        trim: true,
    },
    password:{
        type:String,
        minlength:[6,'Password must have atleast six character'],
        required: true
    },
    role:{
        type:String,
        enum: ['admin', 'user']
    },
    isActive:{
        type:Boolean,
        default:true
    },
    isVerified:{
        type: Boolean,
        default:false
    },
    blocked: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
})

export const userModel = mongoose.model('user',userSchema)