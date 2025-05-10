require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const { errorHandler } = require("./src/middlewares/errorHandler");
const { logger, morganMiddleware } = require("./src/utils/logger");
const routes = require("./src/routes");
const apiLimiter = require("./src/middlewares/rateLimiter");

const app = express();

app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(compression());
app.use(apiLimiter);

app.use(morganMiddleware);

app.use("/api/v1", routes);

app.use((req, res) => {
    logger.warn(`Route not found: ${req.method} ${req.url}`);
    res.status(404).json({
        status: "error",
        message: "Route not found",
    });
});

app.use(errorHandler);

module.exports = app;
