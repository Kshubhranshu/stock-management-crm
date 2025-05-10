const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later.",
    handler: (req, res) => {
        console.log("Rate limit exceeded for IP:", req.ip);
        res.status(429).json({
            status: "error",
            message: "Too many requests from this IP, please try again later.",
        });
    },
});

module.exports = apiLimiter;
