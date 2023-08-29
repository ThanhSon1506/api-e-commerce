const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');



const UserSchema = new mongoose.Schema({
    name: {
        type: String,
    },
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
    admin: {
        type: Boolean,
        default: false,
    },
},
    { timestamps: true }
);

// fire a function after doc saved to db
UserSchema.post('save', function (doc, next) {
    console.log('new user was created & saved', doc);
    next();
});

// fire a function before doc saved to db
UserSchema.pre('save', function (next) {
    console.log('user about to be created & saved', this);
    const bcryptSalt = bcrypt.genSaltSync(12);
    this.password = bcrypt.hashSync(this.password, bcryptSalt);
    next();
});
const userModel = mongoose.model('User', UserSchema);

module.exports = userModel;