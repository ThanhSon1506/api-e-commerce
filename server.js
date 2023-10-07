const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const dbConnect = require('./config/initMongo');
const initRoutes = require('./routers');
const app = express();

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
    optionSuccessStatus: 200,           //access-control-allow-credentials:true
}
dotenv.config();
dbConnect();
app.use(express.json());
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(4000);
initRoutes(app);
// JSON WEB TOKEN