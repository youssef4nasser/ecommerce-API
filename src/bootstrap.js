import { globalError } from "./middleware/globalErrorMiddleware.js";
import brandRouter from "./modules/brand/brand.routes.js";
import categoryRouter from "./modules/category/category.routes.js";
import productRouter from "./modules/product/product.routes.js";
import subCategoryRouter from "./modules/subCategory/subCategory.routes.js";
import { AppError } from "./utils/AppError.js";

export const bootstrap = (app)=>{
    app.use('/api/v1/categories', categoryRouter)
    app.use('/api/v1/subCategories', subCategoryRouter)
    app.use('/api/v1/brands', brandRouter)
    app.use('/api/v1/product', productRouter)

    app.all('*', (req, res, next)=>{
        next(new AppError('Not found endpoint', 404))
    })
    app.use(globalError)
    process.on('unhandledRejection', (err)=>{
        console.log(`Unhandled Rejection at: Promise ${Promise}\nReason:\n${err}\n`)
    })
}