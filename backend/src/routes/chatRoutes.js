const express = require("express");
const router = express.Router();
const { generateChatResponse } = require("../services/chatAIService");
const { chatRequestSchema } = require("../validations/chatValidation");
const { logger } = require("../utils/logger");

router.post("/chat", async (req, res) => {
    try {
        const { error, value } = chatRequestSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: "error",
                message: "Invalid request body",
                details: error.details[0].message,
            });
        }

        logger.info("Processing chat request");
        const result = await generateChatResponse(value.messages);

        res.status(200).json({
            status: "success",
            data: {
                message: result.response,
                usage: result.usage,
            },
        });
    } catch (error) {
        logger.error("Chat request failed:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to process chat request",
            error: error.message,
        });
    }
});

module.exports = router;
