const Joi = require("joi");

const chatRequestSchema = Joi.object({
    messages: Joi.array()
        .items(
            Joi.object({
                role: Joi.string()
                    .valid("user", "assistant", "system")
                    .required(),
                content: Joi.string().required(),
            })
        )
        .min(1)
        .required(),
});

module.exports = {
    chatRequestSchema,
};
