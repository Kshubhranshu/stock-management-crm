const mongoose = require("mongoose");
const { logger } = require("../utils/logger");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {});

        logger.info(`MongoDB Connected: ${conn.connection.host}`);

        mongoose.connection.on("error", (err) => {
            logger.error("MongoDB connection error:", err);
        });

        mongoose.connection.on("disconnected", () => {
            logger.warn("MongoDB disconnected");
        });

        process.on("SIGINT", async () => {
            await mongoose.connection.close();
            process.exit(0);
        });
    } catch (error) {
        logger.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};

module.exports = { connectDB };
