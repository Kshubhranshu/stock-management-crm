const express = require("express");
const router = express.Router();
const { getHealthStatus } = require("../services/healthService");
const { logger } = require("../utils/logger");

router.get("/health", async (req, res) => {
    try {
        logger?.info("Health check endpoint accessed");
        const healthData = await getHealthStatus?.();

        res.status(200).json({
            status: "success",
            data: healthData,
        });
    } catch (error) {
        logger?.error("Health check failed:", error);
        res.status(500).json({
            status: "error",
            message: "Health check failed",
            error: error?.message,
        });
    }
});

module.exports = router;
