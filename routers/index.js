const userRouter = require("./userRouters");
const authRouter = require("./authRouters");
const productRouter = require('./productRouter');
const productCategoryRouter = require('./productCategoryRouter');
const blogCategoryRouter = require('./blogCategoryRouter');

const ErrorHandler = require("../middleware/errorHandler");
const initRoutes = (app) => {
    app.use('/v1/user', userRouter);
    app.use('/v1/auth', authRouter);
    app.use('/v1/product', productRouter);
    app.use('/v1/blog-category', blogCategoryRouter);
    app.use('/v1/product-category', productCategoryRouter);
    
    app.use(ErrorHandler.notFound);
    app.use(ErrorHandler.errorHandler);
}
module.exports = initRoutes;    