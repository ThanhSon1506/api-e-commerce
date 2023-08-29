const jwt = require("jsonwebtoken");
const redisClient = require('../databases/initRedis');

const authMiddleware = {
    // verifyToken
    verifyToken: (req, res, next) => {
        const token = req.headers.token;
        if (token) {
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
                if (err) {
                    return res.status(403).json("Token is not valid");
                }
                req.user = user;
                // verify blacklisted access token
                next();
            });
        }
        else {
            return res.status(401).json("You're not authenticated");
        }
    },
    verifyTokenAndAdminAuth: (req, res, next) => {
        authMiddleware.verifyToken(req, res, () => {
            if (req.user.id === req.params.id || req.user.admin) {
                next();
            }
            else {
                res.status(403).json("You're not allowed to delete other");
            }
        });
    },
    verifyRefreshToken: (req, res, next) => {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken === null) return res.status(401).json({ status: false, message: "Invalid request" });
        try {
            const decodeJwt = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);
            req.userData = decodeJwt;
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
            return res.status(401).json({
                status: false, message: "Your token is not valid", data: error
            });
        }
    },
}

module.exports = authMiddleware;