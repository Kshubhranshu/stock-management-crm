const express = require("express");
const router = express.Router();
const stockService = require("../services/stockService");
const {
    stockPurchaseSchema,
} = require("../validations/stockPurchaseValidation");
const { logger } = require("../utils/logger");

// Search stocks
router.get("/search", async (req, res) => {
    try {
        const { query } = req?.query;
        if (!query) {
            return res.status(400).json({
                status: "error",
                message: "Search query is required",
            });
        }

        const stocks = await stockService?.searchStocks?.(query);
        res.status(200).json({
            status: "success",
            data: stocks,
        });
    } catch (error) {
        logger?.error("Error in search stocks route:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to search stocks",
            error: error?.message,
        });
    }
});

// Get stocks grouped by sector
router.get("/sectors", async (req, res) => {
    try {
        const sectorGroups = await stockService?.getStocksBySector?.();
        res.status(200).json({
            status: "success",
            data: sectorGroups,
        });
    } catch (error) {
        logger?.error("Error in get stocks by sector route:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to fetch stocks by sector",
            error: error?.message,
        });
    }
});

// Create a new stock purchase
router.post("/", async (req, res) => {
    try {
        const { error, value } = stockPurchaseSchema?.validate?.(req?.body);
        if (error) {
            return res.status(400).json({
                status: "error",
                message: "Invalid request data",
                details: error?.details?.[0]?.message,
            });
        }

        const stockPurchase = await stockService?.createStockPurchase?.(value);
        res.status(201).json({
            status: "success",
            message: "Stock purchase created successfully",
            data: stockPurchase,
        });
    } catch (error) {
        logger?.error("Error in create stock purchase route:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to create stock purchase",
            error: error?.message,
        });
    }
});

// Get all stock purchases
router.get("/", async (req, res) => {
    try {
        const stocks = await stockService?.getStockPurchases?.();
        res.status(200).json({
            status: "success",
            data: stocks,
        });
    } catch (error) {
        logger?.error("Error in get stock purchases route:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to fetch stock purchases",
            error: error?.message,
        });
    }
});

// Update stock purchase
router.put("/:id", async (req, res) => {
    try {
        const { error, value } = stockPurchaseSchema?.validate?.(req?.body);
        if (error) {
            return res.status(400).json({
                status: "error",
                message: "Invalid request data",
                details: error?.details?.[0]?.message,
            });
        }

        const stock = await stockService?.updateStockPurchase?.(
            req?.params?.id,
            value
        );
        res.status(200).json({
            status: "success",
            message: "Stock purchase updated successfully",
            data: stock,
        });
    } catch (error) {
        logger?.error("Error in update stock purchase route:", error);
        res.status(400).json({
            status: "error",
            message: "Failed to update stock purchase",
            error: error?.message,
        });
    }
});

// Delete stock purchase
router.delete("/:id", async (req, res) => {
    try {
        await stockService?.deleteStockPurchase?.(req?.params?.id);
        res.status(200).json({
            status: "success",
            message: "Stock purchase deleted successfully",
        });
    } catch (error) {
        logger?.error("Error in delete stock purchase route:", error);
        res.status(400).json({
            status: "error",
            message: "Failed to delete stock purchase",
            error: error?.message,
        });
    }
});

// Get portfolio summary
router.get("/portfolio/summary", async (req, res) => {
    try {
        const summary = await stockService?.getPortfolioSummary?.();
        res.status(200).json({
            status: "success",
            data: summary,
        });
    } catch (error) {
        logger?.error("Error in get portfolio summary route:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to fetch portfolio summary",
            error: error?.message,
        });
    }
});

// Get real-time stock metrics
router.get('/metrics/:stockName', async (req, res) => {
    try {
        const { stockName } = req.params;
        
        if (!stockName) {
            return res.status(400).json({
                status: 'error',
                message: 'Stock name is required'
            });
        }

        const metrics = await stockService.getStockMetrics(stockName);
        res.status(200).json({
            status: 'success',
            data: metrics
        });
    } catch (error) {
        logger.error('Error in get stock metrics route:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch stock metrics',
            error: error?.message
        });
    }
});

module.exports = router;
