//todo future feature
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { logger } = require("../utils/logger");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateChatResponse = async (messages) => {
    try {
        const model = genAI.getGenerativeModel({
            model: process.env.GEMINI_MODEL || "gemini-pro",
        });

        const chat = model.startChat();
        const response = await chat.sendMessage(
            messages[messages.length - 1].content
        );
        const result = await response.response;

        return {
            response: result.text(),
            usage: {
                prompt_tokens: null,
                completion_tokens: null,
                total_tokens: null,
            },
        };
    } catch (error) {
        logger.error("Gemini API Error:", error);
        throw new Error(error.message);
    }
};

module.exports = {
    generateChatResponse,
};
