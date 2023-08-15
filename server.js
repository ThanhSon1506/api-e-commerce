const express = require('express');
const mongodb = require("mongoose");
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcrypt');

const User = require('./models/User');


const app = express();
const bcryptSalt = bcrypt.genSalt();
dotenv.config();
// json
app.use(express.json());
// cors
app.use(cors({
    credentials: true,
    origin: "http://localhost:5173"
}));
console.log(process.env.MONGO_DB);
// mongodb
mongodb.connect(process.env.MONGO_DB);




app.get('/test', (req, res) => {
    res.json('test ok');
});
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    User.create({
        name,
        email,
        password
    });
    res.json({
        name, email, password
    });
})
app.listen(4000);