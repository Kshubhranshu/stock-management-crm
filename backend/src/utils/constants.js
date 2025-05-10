const TIME_CONSTANTS = {
    SECOND: 1,
    MINUTE: 60,
    HOUR: 3600,
    DAY: 86400,
    SEVEN_DAYS: 604800,
    THIRTY_DAYS: 2592000,
};

const CACHE_EXPIRY = {
    FIVE_MINUTES: 300,
    FIFTEEN_MINUTES: 900,
    ONE_HOUR: TIME_CONSTANTS.HOUR,
    ONE_DAY: TIME_CONSTANTS.DAY,
    SEVEN_DAYS: TIME_CONSTANTS.SEVEN_DAYS,
};

const REDIS_KEYS = {
    STOCK: {
        PURCHASES: "stock:purchases",
        METRICS_PREFIX: "stock:metrics:",
        SECTOR_WISE: "stock:sector_wise",
        PORTFOLIO_SUMMARY: "stock:portfolio_summary",
    },
    USER: {
        PROFILE_PREFIX: "user:profile:",
        PREFERENCES_PREFIX: "user:preferences:",
    },
};

const REDIS_CONFIG = {
    MAX_RETRIES: 10,
    RETRY_INTERVAL: 1000,
    MAX_RETRY_DELAY: 5000,
};

module.exports = {
    TIME_CONSTANTS,
    CACHE_EXPIRY,
    REDIS_KEYS,
    REDIS_CONFIG,
};
