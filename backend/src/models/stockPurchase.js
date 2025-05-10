const mongoose = require("mongoose");

const stockPurchaseSchema = new mongoose.Schema(
    {
        stockExchange: {
            type: String,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        sector: {
            type: String,
            required: true,
            trim: true,
        },
        stockCode: {
            type: String,
            required: true,
            trim: true,
            uppercase: true,
        },
        purchasePrice: {
            type: Number,
            required: true,
            min: 0,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const StockPurchase = mongoose.model("StockPurchase", stockPurchaseSchema);

module.exports = StockPurchase;
