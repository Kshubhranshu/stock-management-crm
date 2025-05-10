const StockPurchase = require("../models/stockPurchase");
const { logger } = require("../utils/logger");
const axios = require("axios");
const indianStockService = require("../api/indianStockService");
const redisService = require("./redisService");
const { REDIS_KEYS, CACHE_EXPIRY } = require("../utils/constants");

class StockService {
    async createStockPurchase(stockData) {
        try {
            const stockPurchase = new StockPurchase(stockData);
            await stockPurchase?.save?.();
            redisService
                .del(REDIS_KEYS.STOCK.PURCHASES)
                .catch((error) =>
                    logger.error(
                        `Error deleting cache for ${REDIS_KEYS.STOCK.PURCHASES}:`,
                        error
                    )
                );
            return stockPurchase;
        } catch (error) {
            logger?.error("Error creating stock purchase:", error);
            throw error;
        }
    }

    async getStockPurchases() {
        try {
            const cacheKey = REDIS_KEYS.STOCK.PURCHASES;
            const cachedData = await redisService.get(cacheKey);

            if (cachedData) {
                logger.info("Returning cached stock purchases");
                return cachedData;
            }

            const stocks = await StockPurchase?.find?.(
                {
                    isDeleted: false,
                },
                {
                    _id: 1,
                    name: 1,
                    sector: 1,
                    stockCode: 1,
                    purchasePrice: 1,
                    quantity: 1,
                    stockExchange: 1,
                }
            )
                ?.sort?.({
                    purchaseDate: -1,
                })
                .lean();

            await redisService.set(cacheKey, stocks, CACHE_EXPIRY.SEVEN_DAYS);

            return stocks;
        } catch (error) {
            logger?.error("Error fetching stock purchases:", error);
            throw error;
        }
    }

    async deleteStockPurchase(id) {
        try {
            const stock = await StockPurchase?.findOneAndUpdate?.(
                { _id: id, isDeleted: false },
                { isDeleted: true },
                { new: true }
            );
            if (!stock) {
                throw new Error("Stock purchase not found");
            }
            redisService
                .del(REDIS_KEYS.STOCK.PURCHASES)
                .catch((error) =>
                    logger.error(
                        `Error deleting cache for ${REDIS_KEYS.STOCK.PURCHASES}:`,
                        error
                    )
                );
            logger?.info(`Stock purchase soft deleted for ${stock?.symbol}`);
            return stock;
        } catch (error) {
            logger?.error("Error soft deleting stock purchase:", error);
            throw error;
        }
    }

    async getPortfolioSummary() {
        try {
            const stocks = await StockPurchase?.find?.({ isDeleted: false });
            const summary = {
                totalInvestment: 0,
                totalQuantity: 0,
                sectorWise: {},
            };

            stocks?.forEach?.((stock) => {
                summary.totalInvestment += stock?.purchasePrice ?? 0;
                summary.totalQuantity += stock?.quantity ?? 0;

                if (!summary.sectorWise[stock?.sector]) {
                    summary.sectorWise[stock?.sector] = {
                        investment: 0,
                        quantity: 0,
                    };
                }

                summary.sectorWise[stock?.sector].investment +=
                    stock?.purchasePrice ?? 0;
                summary.sectorWise[stock?.sector].quantity +=
                    stock?.quantity ?? 0;
            });

            return summary;
        } catch (error) {
            logger?.error("Error calculating portfolio summary:", error);
            throw error;
        }
    }

    async searchStocks(query) {
        try {
            const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${query}`;
            const response = await axios?.get?.(url);
            const results = response?.data?.quotes;

            if (!results?.length) {
                return "Stock not found.";
            }

            return results;
        } catch (error) {
            logger?.error("Error searching stocks:", error);
            throw error;
        }
    }

    async getStocksBySector() {
        try {
            const stockList = await this.getStockPurchases();
            if (!stockList?.length) {
                return { message: "No stocks found in portfolio" };
            }
            const stocksWithMetrics = await this.fetchStockMetricsAndFinancials(
                stockList
            );

            const sectorGroups = stocksWithMetrics.reduce((acc, stock) => {
                const sector = stock.sector;
                if (!acc[sector]) {
                    acc[sector] = [];
                }
                acc[sector].push(stock);
                return acc;
            }, {});

            return sectorGroups;
        } catch (error) {
            logger.error("Error fetching stocks by sector:", error);
            throw error;
        }
    }

    async fetchStockMetricsAndFinancials(stockList) {
        try {
            const stockPromises = stockList.map(async (stock) => {
                return await indianStockService.getStockDataFromAPI(stock);
            });

            const stockMetricsAndFinancials = await Promise.all(stockPromises);

            return stockMetricsAndFinancials.map((stock) => {
                const latestEarnings =
                    Array.isArray(stock?.stockTechnicalData) &&
                    stock?.stockTechnicalData.length > 0
                        ? `${stock?.stockTechnicalData[0]?.days} days - BSE: ${stock?.stockTechnicalData[0]?.bsePrice}, NSE: ${stock?.stockTechnicalData[0]?.nsePrice}`
                        : null;

                const presentValue =
                    parseFloat(stock?.currentPrice) *
                    parseInt(stock?.quantity || 0);

                return {
                    ...stock,
                    latestEarnings,
                    presentValue,
                };
            });
        } catch (error) {
            logger.error("Error fetching stock metrics and financials:", error);
            throw error;
        }
    }

    async getStockMetrics(stockName) {
        try {
            if (!stockName) {
                throw new Error('Stock name is required');
            }

            const stockData = await indianStockService.getStockDataFromAPI({ name: stockName });
            
            const latestEarnings = 
                Array.isArray(stockData?.stockTechnicalData) &&
                stockData?.stockTechnicalData.length > 0
                    ? `${stockData?.stockTechnicalData[0]?.days} days - BSE: ${stockData?.stockTechnicalData[0]?.bsePrice}, NSE: ${stockData?.stockTechnicalData[0]?.nsePrice}`
                    : null;

            const presentValue =
                parseFloat(stockData?.currentPrice) *
                parseInt(stockData?.quantity || 0);

            return {
                name: stockName,
                peRatio: stockData?.peRatio,
                currentPrice: stockData?.currentPrice,
                latestEarnings,
                presentValue
            };
        } catch (error) {
            logger.error(`Error fetching metrics for stock ${stockName}:`, error);
            throw error;
        }
    }
}

module.exports = new StockService();
