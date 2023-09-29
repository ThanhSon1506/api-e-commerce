const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const redisClient = require('../config/initRedis');
const expressAsyncHandler = require('express-async-handler');
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
=================================================================
== refresh token => cấp mới access token
== access token => xác thực người dùng, phân quyền người dùng


**/


const authController = {
    // handle errors
    // handleErrors: (err) => {
    //     const errorList = {};
    //     if (err['code'] != undefined) {
    //         for (let x in err) {
    //             const keyValue = Object.keys(err['keyValue'])[0];
    //             if (err['code'] === 11000) {
    //                 errorList[keyValue] = `There is an user with the ${keyValue} repeated.`
    //             }
    //         }
    //     } else {
    //         const errorJson = err['errors'];
    //         for (let x in errorJson) {
    //             errorList[x] = errorJson[x]['properties']['message'];
    //         }
    //     }
    //     throw new Error(errorList);
    // },
    generateAccessToken: (id, role) => {
        return jwt.sign({
            id: id,
            role: role
        },
            process.env.JWT_ACCESS_KEY,
            { expiresIn: process.env.JWT_ACCESS_TIME }
        );
    },

    generateRefreshToken: (id) => {
        return jwt.sign({
            id: id,
        },
            process.env.JWT_REFRESH_KEY,
            { expiresIn: process.env.JWT_REFRESH_TIME }
        );

    },

    postRegister: expressAsyncHandler(async (req, res) => {
        const { firstName, lastName, email, password } = req.body;
        if (!email || !password || !lastName || !firstName)
            return res.status(400).json({
                success: false,
                message: 'Missing inputs'
            });
        const user = await User.findOne({ email });
        if (user)
            throw new Error('User has existed!');
        else {
            const newUser = await User.init().then(() => User.create(req.body));
            return res.status(201).json({
                status: newUser ? true : false,
                message: newUser ? "Register successfully" : "Something went wrong"
            });
        }


    }),

    postLogin: expressAsyncHandler(async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({
                success: false,
                message: 'Missing inputs'
            });
        const user = await User.findOne({ email });
        if (!user)
            throw new Error("Email is not exits");
        if (!await user.isCorrectPassword(password))
            throw new Error("Wrong password");
        if (user && await user.isCorrectPassword(password)) {
            // Create access token
            const accessToken = authController.generateAccessToken(user._id, user.role);
            // Create refresh token
            const refreshToken = authController.generateRefreshToken(user._id);

            // Save refresh token in database
            // await User.findByIdAndUpdate(user._id, { refreshToken }, { new: true });

            // Save refresh token in redis
            redisClient.set(user._id.toString(), JSON.stringify({ token: refreshToken }));
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            });
            const { password, role, ...other } = user._doc;
            return res.status(201).json({ status: true, message: "Login successfully", ...other, accessToken });
        }

    }),
    // Redis
    requestRefreshToken: expressAsyncHandler(async (req, res) => {
        // Take refresh token from user
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) throw new Error('No refresh token in cookies');
        // Do is token in valid ?
        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, async (err, user) => {
            if (err) throw new Error(error);
            // Create new accessToken, refresh token
            const newAccessToken = authController.generateAccessToken(user.id, user.role);
            // const newRefreshToken = authController.generateRefreshToken(user.id, user.admin);
            // Save redis in database
            // redisClient.set(user.id, JSON.stringify({ token: newRefreshToken }));
            // =========In with mongodb========
            // Check token is correct token had save database
            // const response = await User.findOne({ _id: user.id, refreshToken: refreshToken });
            // ================================
            // res.cookie("refreshToken", newRefreshToken, {
            //     httpOnly: true,
            //     secure: false,
            //     path: "/",
            //     sameSite: "strict",
            // });
            return res.status(200).json({ accessToken: newAccessToken });
        });
    }),
    userLogout: expressAsyncHandler(async (req, res) => {
        const refreshToken = req.cookies.refreshToken;
        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, async (err, user) => {
            if (err) throw new Error(error);
            // delete refresh token in database mongo 
            // await User.findOneAndUpdate({ refreshToken: cookie.refreshToken }, { refreshToken: '' }, { new: true })
            // remove the refresh token
            await redisClient.del(user.id);
            // blacklist current access token
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: true,
            });
            return res.status(200).json({ success: true, message: "Logged out!" });
        });
    }),

};


module.exports = authController;
