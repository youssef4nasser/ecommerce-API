import { cartModel } from "../../../database/models/cart.model.js"
import { couponModel } from "../../../database/models/coupon.model.js"
import { productModel } from "../../../database/models/product.model.js"
import { AppError } from "../../utils/AppError.js"
import { catchError } from "../../utils/catchError.js"

function calcTotalPrice(cart){
    let totalPrice = 0
    cart.cartItems.forEach(elm => {
        totalPrice += elm.quantity * elm.price
    })
    cart.totalPrice = totalPrice
}

export const addProductToCart = catchError(
    async(req, res, next)=>{
        const product = await productModel.findById(req.body.product).select("price")
        if(!product) return next(new AppError(`No Product found with this id`, 401))
        req.body.price = product.price

        const isCartExist = await cartModel.findOne({user: req.user.id})
        if(!isCartExist){
            const cart = new cartModel({
                user: req.user.id,
                cartItems: [req.body]
            })
            calcTotalPrice(cart)
            await cart.save()
            return res.status(201).json({message: 'success', cart})
        }

        const item = isCartExist.cartItems.find(elm => elm.product == req.body.product)
        if(item){
            item.quantity += req.body.quantity || 1
        } else{   
            isCartExist.cartItems.push(req.body)
        }
        calcTotalPrice(isCartExist)
        
        if(isCartExist.discount){
            isCartExist.totalPriceAfterDiscount = isCartExist.totalPrice - (isCartExist.totalPrice * isCartExist.discount) / 100    
        }
        await isCartExist.save()
        return res.status(201).json({message: 'add to cart', cart: isCartExist})
    }
)

export const removeProductFromCart = catchError(
    async (req,res ,next)=> {
        const result = await cartModel.findOneAndUpdate({user: req.user._id}, {$pull: {cartItems: {_id: req.params.id}}}, {new: true})
        !result && next(new AppError(`Item not found`, 404))
        calcTotalPrice(result)
        if(result.discount){
            result.totalPriceAfterDiscount = result.totalPrice - (result.totalPrice * result.discount) / 100    
        }
        result && res.status(201).json({message: 'success', cart: result})
    }
)

export const updateQuantity = catchError(
    async(req, res, next)=>{
        const product = await productModel.findById(req.params.id).select('price')
        if(!product) return next(new AppError(`No Product found with this id`, 404))

        const isCartExist = await cartModel.findOne({user: req.user._id})

        const item = isCartExist.cartItems.find(elm => elm.product == req.params.id)

        if(item){
            item.quantity = req.body.quantity
        }

        calcTotalPrice(isCartExist)
        if(isCartExist.discount){
            isCartExist.totalPriceAfterDiscount = isCartExist.totalPrice - (isCartExist.totalPrice * isCartExist.discount) / 100    
        }
        await isCartExist.save()
        return res.status(201).json({message: 'success', cart: isCartExist})
    }
)

export const applyCoupon = catchError(
    async (req,res, next)=> {
        let coupon = await couponModel.findOne({code: req.body.code, expires: {$gt: Date.now()}})
        let cart = await cartModel.findOne({user: req.user._id})    
        cart.totalPriceAfterDiscount = cart.totalPrice - (cart.totalPrice * coupon.discount) / 100    
        cart.discount = coupon.discount
        await cart.save()
        res.status(201).json({message: 'success', cart})
    }
)

export const getLogedUserCart = catchError(
    async (req,res, next)=> {
        let cart = await cartModel.findOne({user: req.user.id})
        .populate('cartItems.product')  
        return res.status(201).json({message: 'success', cart})
    }
)
