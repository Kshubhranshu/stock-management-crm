const express = require("express");
const router = express.Router();
const chatRoutes = require("./chatRoutes");
const stockRoutes = require("./stockRoutes");
const healthRoutes = require("./healthRoutes");

// Mount chat routes
router.use("/health", healthRoutes);
router.use("/chat", chatRoutes);
router.use("/stocks", stockRoutes);

module.exports = router;
