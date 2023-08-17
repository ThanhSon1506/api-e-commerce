const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const bcryptSalt = bcrypt.genSaltSync(12);
const jwtSecret = "asd4sdsd14asd14sda1s4d5sdc4b";

// handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' };
    // validation errors
    if (err.message.includes('user validator failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors;
}

module.exports.postRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const newUser = User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt),
        });
        return res(201).json(newUser);
    } catch (errors) {
        const error = handleErrors(errors);
        res.status(422).json(errors);
    }
}

module.exports.postLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                jwt.sign({ email: user.email, id: user._id }, jwtSecret, {}, (err, token) => {
                    if (err) throw err;
                    return res.cookie("token", token).json('pass ok');
                });
            } else {
                return res.json('pass not ok');
            }
        } else {
            return res.json('not found');
        }

    } catch (error) {
        // const error = handleErrors(errors);
        console.log(error);
        res.status(422).json(error);
    }

}