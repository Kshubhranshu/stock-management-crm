const axios = require("axios");
const { logger } = require("../utils/logger");
const redisService = require("../services/redisService");
const { CACHE_EXPIRY } = require("../utils/constants");

class IndianStockService {
    async getStockDataFromAPI(stock) {
        try {
            const cacheKey = `stock:${stock?.name}`;
            const cachedData = await redisService.get(cacheKey);

            if (cachedData) {
                logger.info(`Returning cached stock data for ${stock?.name}`);
                return cachedData;
            }

            const url = `https://stock.indianapi.in/stock?name=${encodeURIComponent(
                stock?.name
            )}`;
            const response = await axios.get(url, {
                headers: {
                    "X-Api-Key": process.env.STOCK_API_KEY,
                },
            });

            if (!response.data) {
                if (response.data.error) {
                    logger.warn(
                        `API returned error for ${stock?.name}: ${response.data.error}`
                    );
                    return stock;
                }
            }

            const stockData = {
                ...stock,
                sector: stock?.sector || response?.data?.industry,
                currentPrice:
                    stock?.stockExchange === "BSE"
                        ? response?.data?.currentPrice?.BSE
                        : response?.data?.currentPrice?.NSE,
                peRatio: response?.data?.percentChange,
                recentNews: response?.data?.recentNews,
                stockTechnicalData: response?.data?.stockTechnicalData,
                stockCode:
                    stock?.stockExchange === "BSE"
                        ? response?.data?.companyProfile?.exchangeCodeBse ||
                          stock?.stockCode
                        : response?.data?.companyProfile?.exchangeCodeNse ||
                          stock?.stockCode,
            };

            logger.info(
                `Extracted stock metrics for ${stock?.name}:`,
                stockData
            );

            await redisService.set(cacheKey, stockData, CACHE_EXPIRY.ONE_DAY);

            return stockData;
        } catch (error) {
            logger.error("Error fetching stock data from API:", error);
            throw error;
        }
    }
}

module.exports = new IndianStockService();
