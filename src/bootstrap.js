import morgan from "morgan";
import { dbConnection } from "../database/dbConnection.js";
import { globalError } from "./middleware/globalErrorMiddleware.js";
import { AppError } from "./utils/AppError.js";
import brandRouter from "./modules/brand/brand.routes.js";
import categoryRouter from "./modules/category/category.routes.js";
import productRouter from "./modules/product/product.routes.js";
import subCategoryRouter from "./modules/subCategory/subCategory.routes.js";
import userRouter from "./modules/user/user.routes.js";
import authRouter from "./modules/auth/auth.routes.js";
import reviewRouter from "./modules/review/review.routes.js";
import wishlistRouter from "./modules/wishlist/wishlist.routes.js";
import addressRouter from "./modules/address/address.routes.js";
import couponRouter from "./modules/coupon/coupon.routes.js";
import cartRouter from "./modules/cart/cart.routes.js";
import orderRouter from "./modules/order/order.routes.js";

export const bootstrap = (app)=>{
    app.use('/api/v1/categories', categoryRouter)
    app.use('/api/v1/subCategories', subCategoryRouter)
    app.use('/api/v1/brands', brandRouter)
    app.use('/api/v1/products', productRouter)
    app.use('/api/v1/users', userRouter)
    app.use('/api/v1/auth', authRouter)
    app.use('/api/v1/reviews', reviewRouter)
    app.use('/api/v1/wishlist', wishlistRouter)
    app.use('/api/v1/address', addressRouter)
    app.use('/api/v1/coupons', couponRouter)
    app.use('/api/v1/carts', cartRouter)
    app.use('/api/v1/orders', orderRouter)
    app.all('*', (req, res, next)=>{
        next(new AppError('Not found endpoint', 404))
    })
    // Global error handler middleware
    app.use(globalError)

    // connection to database
    dbConnection()

    app.use(morgan('dev'))

    process.on('unhandledRejection', (err)=>{
        console.log(`Unhandled Rejection at: Promise ${Promise}\nReason:\n${err}\n`)
    })
}