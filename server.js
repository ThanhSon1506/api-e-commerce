const express = require('express');
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRouter = require('./routers/authRouters');
const userRouter = require('./routers/userRouters');

const app = express();
const corsOptions = {
    credentials: true,
    origin: 'http://127.0.0.1:5173',
}


dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    corsOptions
}));
app.options('*', cors(corsOptions));

// mongodb
mongoose
    .connect(process.env.MONGO_LOCAL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Database connected!"))
    .catch(err => console.log(err));
app.listen(4000);

app.use("/v1/auth", authRouter);
app.use("/v1/user", userRouter);

// JSON WEB TOKEN