const winston = require("winston");
const morgan = require("morgan");
const path = require("path");

// Create logs directory if it doesn't exist
const fs = require("fs");
const logsDir = process.env.LOG_FILE_PATH || "./logs";
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// Custom format for pretty logging
const prettyFormat = winston.format.printf(({ level, message, timestamp }) => {
    // Remove ANSI color codes from message
    const cleanMessage = message.replace(/\u001b\[\d+m/g, "");
    return `[${timestamp}] ${level.toUpperCase()}: ${cleanMessage}`;
});

const logFormat = winston.format.combine(
    winston.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.errors({ stack: true }),
    prettyFormat
);

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: logFormat,
    transports: [
        new winston.transports.File({
            filename: path.join(logsDir, "error.log"),
            level: "error",
        }),
        new winston.transports.File({
            filename: path.join(logsDir, "combined.log"),
        }),
    ],
});

// Add console transport for non-production environments
if (process.env.NODE_ENV !== "production") {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                prettyFormat
            ),
        })
    );
}

// Create morgan middleware with custom format
const morganFormat = ":method :url :status - :response-time ms";
const morganMiddleware = morgan(morganFormat, {
    stream: {
        write: (message) => logger.info(message.trim()),
    },
});

module.exports = {
    logger,
    morganMiddleware,
};
