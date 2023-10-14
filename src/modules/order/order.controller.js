import Stripe from 'stripe';
import { cartModel } from "../../../database/models/cart.model.js"
import { orderModel } from "../../../database/models/order.model.js"
import { productModel } from "../../../database/models/product.model.js"
import { AppError } from "../../utils/AppError.js"
import { catchError } from "../../utils/catchError.js"

export const cashOrder = catchError(
    async(req, res, next)=>{
        // get cart (cartID)
        const cart = await cartModel.findById(req.params.id)
        // cal total price
        const totalOrderPrice = cart.totalPriceAfterDiscount ?
        cart.totalPriceAfterDiscount : cart.totalPrice
        // create order
        const order = new orderModel({
            user: req.user._id,
            cartItems: cart.cartItems,
            totalOrderPrice,
            shippingAddress: req.body.shippingAddress
        })
        await order.save()

        if(order){
            // increment sold & decrement quantity
            const potions = cart.cartItems.map(item =>({
                updateOne: {
                    filter: {_id: item.product},
                    update: {$inc: {stock: -item.quantity, sold: item.quantity}}
                }
            }))
            await productModel.bulkWrite(potions)
            // clear user cart
            await cartModel.findByIdAndDelete(req.params.id)
            res.status(201).json({message: 'success', order})
        }
        else{
            return next(new AppError('Error in cart id', 404))
        }
    }
)

const stripe = new Stripe('sk_test_51NotS6HLeUVvC3Quw1NbYvAQeEDsoZaXSG3NPBhiq4TXMe93JIj8yjCGMfLJU4jzp4YrTBfSI1AcnKPijJ90EM6H00HdK87C1k');

export const checkoutSession = catchError(
    async(req,res,next)=>{
        // get cart (cartID)
        const cart = await cartModel.findById(req.params.id)
        // cal total price
        const totalOrderPrice = cart.totalPriceAfterDiscount ?
        cart.totalPriceAfterDiscount : cart.totalPrice

        const session = await stripe.checkout.sessions.create({
            line_items:[
                {
                    price_data: {
                        currency: "egp",
                        unit_amount: totalOrderPrice * 100,
                        product_data: {
                            name: req.user.name
                        }
                    },
                    quantity: 1
                }
            ],
            mode: 'payment', // (payment / setup / subscription)
            success_url: "https://youssef4nasser.github.io/FreshCart/",
            cancel_url: "https://youssef4nasser.github.io/FreshCart/",
            customer_email: req.user.email,
            client_reference_id: req.params.id,
            metadata: req.body.shippingAddres,
        })
        res.status(200).json({message: 'success', session})
    }
)

export const getSpecificOrder = catchError(
    async(req,res,next)=>{
        const order = await orderModel.findOne({user: req.user.id})
        .populate([
            {
                path: 'cartItems.product',
            },
            {
                path: 'user',
                select: ['name', 'email']
            }
        ])
        res.status(200).json({message: 'success', order})
    }
)

export const getAllOrders = catchError(
    async(req,res,next)=>{
        const orders = await orderModel.find({})
        .populate([
        {
            path: 'cartItems.product',
        },
        {
            path: 'user',
            select: ['name', 'email']
        }
    ])
        res.status(200).json({message: 'success', orders})
    }
)