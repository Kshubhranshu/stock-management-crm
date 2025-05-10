require("dotenv").config();
const app = require("./app");
const { connectDB } = require("./src/config/db");
const { logger } = require("./src/utils/logger");

const PORT = process.env.PORT || 3000;

process.on("uncaughtException", (err) => {
    logger.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    logger.error(err.name, err.message);
    process.exit(1);
});

const server = app.listen(PORT, async () => {
    await connectDB();
    logger.info(
        `Server running on port ${PORT} in ${process.env.NODE_ENV} mode`
    );
});

process.on("unhandledRejection", (err) => {
    logger.error("UNHANDLED REJECTION! 💥 Shutting down...");
    logger.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

process.on("SIGTERM", () => {
    logger.info("👋 SIGTERM RECEIVED. Shutting down gracefully");
    server.close(() => {
        logger.info("💥 Process terminated!");
    });
});
