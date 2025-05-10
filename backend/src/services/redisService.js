const redisClient = require("../config/redis");
const { logger } = require("../utils/logger");
const { CACHE_EXPIRY } = require("../utils/constants");

class RedisService {
    async set(key, value, expiry = CACHE_EXPIRY.ONE_HOUR) {
        try {
            const stringValue =
                typeof value === "object" ? JSON.stringify(value) : value;
            await redisClient.set(key, stringValue, { EX: expiry });
            return true;
        } catch (error) {
            logger.error(`Redis set error for key ${key}:`, error);
            throw error;
        }
    }

    async get(key) {
        try {
            const value = await redisClient.get(key);
            if (!value) return null;

            try {
                return JSON.parse(value);
            } catch {
                return value;
            }
        } catch (error) {
            logger.error(`Redis get error for key ${key}:`, error);
            throw error;
        }
    }

    async delete(key) {
        try {
            await redisClient.del(key);
            return true;
        } catch (error) {
            logger.error(`Redis delete error for key ${key}:`, error);
            throw error;
        }
    }

    async exists(key) {
        try {
            return await redisClient.exists(key);
        } catch (error) {
            logger.error(`Redis exists error for key ${key}:`, error);
            throw error;
        }
    }

    async setHash(key, field, value) {
        try {
            const stringValue =
                typeof value === "object" ? JSON.stringify(value) : value;
            await redisClient.hSet(key, field, stringValue);
            return true;
        } catch (error) {
            logger.error(
                `Redis setHash error for key ${key}, field ${field}:`,
                error
            );
            throw error;
        }
    }

    async getHash(key, field) {
        try {
            const value = await redisClient.hGet(key, field);
            if (!value) return null;

            try {
                return JSON.parse(value);
            } catch {
                return value;
            }
        } catch (error) {
            logger.error(
                `Redis getHash error for key ${key}, field ${field}:`,
                error
            );
            throw error;
        }
    }

    async getAllHash(key) {
        try {
            const hash = await redisClient.hGetAll(key);
            return hash;
        } catch (error) {
            logger.error(`Redis getAllHash error for key ${key}:`, error);
            throw error;
        }
    }
}

module.exports = new RedisService();
