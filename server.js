const express = require('express');
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const cors = require('cors');
const authRouter = require('./routers/authRouters');




const app = express();

dotenv.config();
// json
app.use(express.json());
// cors
const corsOptions = {
    credentials: true,
    origin: 'http://127.0.0.1:5173',
    exposedHeaders: ['set-cookie'],
}
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
app.use(authRouter)