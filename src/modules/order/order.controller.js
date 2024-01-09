import Stripe from 'stripe';
import { AppError } from "../../utils/AppError.js"
import { catchError } from "../../utils/catchError.js"
import productModel from '../../../database/models/product.model.js';
import userModel from '../../../database/models/user.model.js';
import cartModel from "../../../database/models/cart.model.js"

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

const stripe = new Stripe(process.env.STRIPE_KEY);

export const createCheckoutSession = catchError(
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

export const createOnlineOrder = catchError(
    async (req, res, next) => {
        const sig = req.headers['stripe-signature'].toString()
      
        let event;
    
        try {
          event = stripe.webhooks.constructEvent(req.body, sig, process.env.END_POINT_SECRET);
        } catch (err) {
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }
      
        // Handle the event
        if(event.type == "checkout.session.completed"){
            // get cart (cartID)
            const cart = await cartModel.findById(event.data.object.client_reference_id)
            if(!cart) return next(new AppError(`Cart not found with this id ${event.data.client_reference_id}`, 404))


            let user = await userModel.findOne({email: event.data.object.customer_email})
            // create order
            const order = new orderModel({
                user: user._id,
                cartItems: cart.cartItems,
                totalOrderPrice: event.data.object.amount_total / 100,
                shippingAddress: event.data.object.metadata,
                paymentMethond: "card",
                isPaid: true,
                paidAt: Date.now()
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
                await cartModel.findByIdAndDelete(cart._id)
                return res.status(201).json({message: 'success', order})
            }
            else{
                return next(new AppError('Error in cart id', 404))
            }

        }else{
            return res.status(400).json({message: `Payment failed and order rejected ${event.type}`})
        }
})

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