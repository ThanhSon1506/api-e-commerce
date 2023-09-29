const userRouter = require("./userRouters");
const authRouter = require("./authRouters");
const productRouter = require('./productRouter');

const ErrorHandler = require("../middleware/errorHandler");
const initRoutes = (app) => {
    app.use('/v1/user', userRouter);
    app.use('/v1/auth', authRouter);
    app.use('/v1/product', productRouter);
    app.use(ErrorHandler.notFound);
    app.use(ErrorHandler.errorHandler);
}
module.exports = initRoutes;