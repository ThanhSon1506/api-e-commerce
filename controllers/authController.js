const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const redisClient = require('../databases/initRedis');
/* 
Store token
1) Local storage
 XSS : sẽ bị chạy lệnh script lấy token
2) HTTPONLY Cookies 
 - ít bị ảnh hưởng xss, nhưng lại nguy hiểm với tk tấn công CSRF
 - Có thể khắc phục CSRF -> SAMESITE của tk cookie
3) Redux Store -> ACCESS TOKEN
   HTTPONLY COOKIES -> REFRESHTOKEN

=> BFF PATERN (Backend for Frontend)
**/


const authController = {
    // handle errors
    handleErrors: (err) => {
        const errorList = {};
        if (err['code'] != undefined) {
            for (let x in err) {
                const keyValue = Object.keys(err['keyValue'])[0];
                if (err['code'] === 11000) {
                    errorList[keyValue] = `There is an user with the ${keyValue} repeated.`
                }
            }
        } else {
            const errorJson = err['errors'];
            for (let x in errorJson) {
                errorList[x] = errorJson[x]['properties']['message'];
            }
        }
        return errorList;
    },
    generateAccessToken: (id, booleanAdmin) => {
        return jwt.sign({
            id: id,
            admin: booleanAdmin
        },
            process.env.JWT_ACCESS_KEY,
            { expiresIn: process.env.JWT_ACCESS_TIME }
        );
    },

    generateRefreshToken: (id, booleanAdmin) => {
        return jwt.sign({
            id: id,
            admin: booleanAdmin
        },
            process.env.JWT_REFRESH_KEY,
            { expiresIn: process.env.JWT_REFRESH_TIME }
        );

    },

    postRegister: async (req, res) => {
        const { name, email, password } = req.body;
        const propertyRemove = 'password';
        try {
            const user = await User.create({
                name,
                email,
                password,
            });
            const token = authController.generateAccessToken(user);
            const { [propertyRemove]: property_remove, ...other } = user._doc;
            res.status(201).json({ status: true, message: "Register successfully", data: other });
        } catch (err) {
            const errors = authController.handleErrors(err);
            res.status(400).json({ errors });
        }
    },

    postLogin: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                return res.json("Email is not exits");
            }
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.json('Wrong password');
            }
            if (user && validPassword) {
                const accessToken = authController.generateAccessToken(user._id, user.admin);
                const refreshToken = authController.generateRefreshToken(user._id, user.admin);
                // refreshTokens.push(refreshToken);
                redisClient.set(user._id.toString(), JSON.stringify({ token: refreshToken }));

                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: process.env.JWT_SECURE,
                    path: "/",
                    sameSite: "strict",
                });
                const { password, ...other } = user._doc;
                res.status(201).json({ status: true, message: "Login successfully", ...other, accessToken });
            }
        } catch (err) {
            const errors = authController.handleErrors(err);
            console.log(err);
            res.status(400).json({ errors });
        }

    },
    // Redis
    requestRefreshToken: async (req, res) => {
        // Take refresh token from user
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json("You're not authenticated");

        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
            if (err) {
                console.log(err);
            }
            // Create new accessToken, refresh token
            const newAccessToken = authController.generateAccessToken(user.id, user.admin);
            const newRefreshToken = authController.generateRefreshToken(user.id, user.admin);

            redisClient.set(user.id, JSON.stringify({ token: newRefreshToken }));

            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: process.env.JWT_SECURE,
                path: "/",
                sameSite: "strict",
            });
            res.status(200).json({ accessToken: newAccessToken });
        });
    },
    userLogout: async (req, res) => {
        const refreshToken = req.cookies.refreshToken;
        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, async (err, user) => {
            if (err) {
                console.log(err);
            }
            // remove the refresh token
            await redisClient.del(user.id);
            // blacklist current access token
            res.clearCookie("refreshToken");
            res.status(200).json({ status: true, message: "Logged out!" });
        });
    }
};


module.exports = authController;
