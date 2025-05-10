const { logger } = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (process.env.NODE_ENV === "development") {
        logger.error({
            message: err.message,
            stack: err.stack,
            status: err.status,
            statusCode: err.statusCode,
        });
    } else {
        logger.error({
            message: err.message,
            status: err.status,
            statusCode: err.statusCode,
        });
    }

    if (err.name === "ValidationError") {
        return res.status(400).json({
            status: "error",
            message: "Validation Error",
            errors: err.errors,
        });
    }

    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
            status: "error",
            message: "Invalid token. Please log in again!",
        });
    }

    if (err.name === "TokenExpiredError") {
        return res.status(401).json({
            status: "error",
            message: "Your token has expired! Please log in again.",
        });
    }

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
};

module.exports = { errorHandler };
