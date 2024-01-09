import { Schema, model } from "mongoose";
import slugify from "slugify";

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

// slug name when ceate new brand
brandSchema.pre('save', function(){
    this.slug = slugify(this.name)
})

// slug name when updating brand
brandSchema.pre('findOneAndUpdate', function() {
    if(this._update.name){
        this._update.slug = slugify(this._update.name);
    }
});

export default model("Brand", brandSchema)