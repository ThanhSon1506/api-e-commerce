const mongoose = require('mongoose');
const { isEmail } = require('validator');



const UserSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: [true, 'Please enter an email'],
        required: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter an password'],
        minLength: [6, 'Minimum password length is 6 characters']
    },
});

const userModel = mongoose.model('User', UserSchema);

module.exports = userModel;