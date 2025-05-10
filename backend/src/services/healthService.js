const { logger } = require("../utils/logger");
const os = require("os");
const mongoose = require("mongoose");

const getHealthStatus = async () => {
    try {
        const uptime = process.uptime();
        const timestamp = new Date().toISOString();

        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        const formattedUptime = `${hours}h ${minutes}m ${seconds}s`;

        const totalMemory = os.totalmem();
        const freeMemory = os.freemem();
        const usedMemory = totalMemory - freeMemory;
        const memoryUsage = ((usedMemory / totalMemory) * 100).toFixed(2);
        const dbState =
            mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";
        const redisState = redisClient.isReady ? "Connected" : "Disconnected";

        return {
            status: "healthy",
            timestamp,
            database: dbState,
            redis: redisState,
            server: {
                uptime: formattedUptime,
                memory: {
                    usage: `${memoryUsage}%`,
                    total: `${(totalMemory / (1024 * 1024 * 1024)).toFixed(
                        2
                    )} GB`,
                    free: `${(freeMemory / (1024 * 1024 * 1024)).toFixed(
                        2
                    )} GB`,
                },
                environment: process.env.NODE_ENV || "development",
                nodeVersion: process.version,
            },
        };
    } catch (error) {
        logger.error("Health check error:", error);
        throw new Error("Failed to get system health status");
    }
};

module.exports = { getHealthStatus };
