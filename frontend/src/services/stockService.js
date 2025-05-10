import api from "./api";
import { handleError } from "@/utils/errorHandler";

export const searchStocks = async (query) => {
    try {
        const response = await api.get("/stocks/search", {
            params: { query },
        });
        return response.data;
    } catch (error) {
        return handleError("searchStocks", error);
    }
};

export const purchaseStock = async (stockData) => {
    try {
        const response = await api.post("/stocks", stockData);
        return response.data;
    } catch (error) {
        return handleError("purchaseStock", error);
    }
};

export const getSectorWiseStocks = async () => {
    try {
        const response = await api.get("/stocks/sectors");
        return response.data;
    } catch (error) {
        return handleError("getSectorWiseStocks", error);
    }
};

export const getStockPurchaseSummary = async () => {
    try {
        const response = await api.get("/stocks/portfolio/summary");
        if (response.data.status === "success") {
            return response.data.data;
        }
        throw new Error("Failed to fetch portfolio summary");
    } catch (error) {
        return handleError("getStockPurchaseSummary", error);
    }
};
