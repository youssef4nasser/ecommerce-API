import { Schema, model, mongoose } from "mongoose";

const orderSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    cartItems: [
        {
            product: {type: Schema.Types.ObjectId, ref: "Product" },
            quantity: {
                type : Number ,
                default : 1
            },
            price: Number,
        }
    ],
    totalOrderPrice: Number,
    shippingAddress: {
        city: String,
        streetName:String,
        phone: String
    },
    paymentMethond: {
        type: String,
        enum: ['card', 'cach'],
        default: 'cach'
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paidAt: Date,
    isDelivered: {
        type: Boolean,
        default: false
    },
    deliveredAt: Date,

}, {timestamps: true})

export default model('Order', orderSchema)