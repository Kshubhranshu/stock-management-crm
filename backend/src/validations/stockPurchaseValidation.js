const Joi = require("joi");

const stockPurchaseSchema = Joi.object({
    stockExchange: Joi.string().trim().messages({}),
    name: Joi.string().required().trim().min(2).max(100).messages({
        "string.empty": "Name is required",
        "string.min": "Name should be at least 2 characters long",
        "string.max": "Name should not exceed 100 characters",
    }),
    sector: Joi.string().required().trim().min(2).max(50).messages({
        "string.empty": "Sector is required",
        "string.min": "Sector should be at least 2 characters long",
        "string.max": "Sector should not exceed 50 characters",
    }),
    stockCode: Joi.string()
        .required()
        .trim()
        .uppercase()
        .pattern(/^[A-Z0-9\W]+$/)
        .messages({
            "string.empty": "Stock Code is required",
            "string.pattern.base":
                "Stock Code should contain only uppercase letters and numbers",
        }),
    purchasePrice: Joi.number().required().min(0).precision(2).messages({
        "number.base": "Purchase price must be a number",
        "number.min": "Purchase price cannot be negative",
        "number.precision":
            "Purchase price should have maximum 2 decimal places",
    }),
    quantity: Joi.number().required().min(1).integer().messages({
        "number.base": "Quantity must be a number",
        "number.min": "Quantity must be at least 1",
        "number.integer": "Quantity must be a whole number",
    }),
});

module.exports = {
    stockPurchaseSchema,
};
