const jwt = require("jsonwebtoken");
const redisClient = require('../config/initRedis');
const expressAsyncHandler = require("express-async-handler");

const authMiddleware = {
    // verifyToken
    verifyToken: expressAsyncHandler((req, res, next) => {
        const token = req.headers.authorization;
        if (token) {
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
                if (err) {
                    return res.status(403).json({
                        success: false,
                        message: "Token is not valid",
                        stack: err
                    });
                }
                req.user = user;
                // verify blacklisted access token
                next();
            });
        }
        else {
            return res.status(401).json({ success: false, message: "You're not authenticated" });
        }
    }),
    verifyAdminAuth: expressAsyncHandler((req, res, next) => {
        const { role } = req.user;
        if (role !== "admin")
            return res.status(401).json({
                success: false,
                message: "Required admin role"
            })
        next();
        // authMiddleware.verifyToken(req, res, () => {
        // });
    }),
    verifyRefreshToken: expressAsyncHandler((req, res, next) => {
        const refreshToken = req.cookies.refreshToken;
        console.log("refreshToken", refreshToken);
        if (refreshToken === null) return res.status(401).json({ status: false, message: "Invalid request" });
        try {
            const decodeJwt = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);
            console.log(decodeJwt);
            // verify if token is cookie or not
            redisClient.get(decodeJwt.id, (err, data) => {
                if (err) {
                    console.log(err);
                }
                if (data === null) return res.status(401).json({ status: false, message: "Invalid request. Token is not invalid" });
                if (JSON.parse(data).token != refreshToken) return res.status(401).json({ status: false, message: "Invalid request. Token is not invalid" });
                next();
            });
        } catch (error) {
            console.log(error);
            return res.status(401).json({
                status: false, message: "Your token is not valid", data: error
            });
        }
    })
    ,
}

module.exports = authMiddleware;