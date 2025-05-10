const { createClient } = require("redis");
const { logger } = require("../utils/logger");

const redisClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
    password: process.env.REDIS_PASSWORD || "",
});

redisClient.on("error", (err) => {
    logger.error("Redis Client Error:", err);
});

redisClient.on("connect", () => {
    logger.info("Redis Client Connected");
});

(async () => {
    try {
        await redisClient.connect();
    } catch (error) {
        logger.error("Redis Connection Error:", error);
    }
})();

module.exports = redisClient;
