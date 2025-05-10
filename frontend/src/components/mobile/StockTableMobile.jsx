"use client";

import { useState } from "react";
import Image from "next/image";
import AnalyzeButton from "../AnalyzeButton";
import StockAnalysisChat from "../StockAnalysisChat";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useStockUpdates } from "@/hooks/useStockUpdates";
import StockChatMobileDrawer from "./StockChatMobileDrawer";

const StockTableMobile = ({ sectorWiseStocks: initialSectorWiseStocks }) => {
    const [selectedStock, setSelectedStock] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [selectedSector, setSelectedSector] = useState(null);
    const isMobile = useIsMobile();
    
    // Use the periodic updates hook
    const { sectorWiseStocks, lastUpdateTime } = useStockUpdates(initialSectorWiseStocks);

    if (!sectorWiseStocks || Object.keys(sectorWiseStocks).length === 0) {
        return (
            <div className="w-full p-8 text-center text-gray-500 flex flex-col items-center justify-center space-y-4">
                <div className="relative w-40 h-40">
                    <Image
                        src="/empty-stocks-cart.svg"
                        alt="No data illustration"
                        fill
                        className="object-contain"
                    />
                </div>
                <div className="text-lg font-semibold text-gray-700">
                    No stocks data available
                </div>
                <p className="text-sm text-gray-500">
                    Looks like there’s nothing here right now. Start adding
                    stocks to see them here.
                </p>
            </div>
        );
    }

    const totalInvestment = Object.values(sectorWiseStocks).reduce(
        (total, stocks) =>
            total +
            stocks.reduce(
                (sum, stock) =>
                    sum + (stock?.purchasePrice || 0) * (stock?.quantity || 0),
                0
            ),
        0
    );

    const formatNumber = (number, decimals = 2) =>
        number || number === 0
            ? number.toLocaleString("en-IN", {
                  minimumFractionDigits: decimals,
                  maximumFractionDigits: decimals,
              })
            : "N/A";

    const formatCurrency = (number) =>
        number || number === 0 ? `₹${formatNumber(number)}` : "N/A";

    const formatPercentage = (number) =>
        number || number === 0 ? `${formatNumber(number)}%` : "N/A";

    const handleAnalyzeClick = (stock, sector) => {
        setSelectedStock({
            ...stock,
            sector,
            stockName: stock?.name,
            investment: (stock?.purchasePrice || 0) * (stock?.quantity || 0),
            gainLoss:
                (stock?.presentValue || 0) -
                (stock?.purchasePrice || 0) * (stock?.quantity || 0),
        });
        setSelectedSector(sector);
        setIsChatOpen(true);
    };

    return (
        <div className="w-full pb-12">
            <div className="text-xs text-gray-500 px-6 mb-4">
                Last updated: {lastUpdateTime.toLocaleTimeString()}
            </div>
            {Object.entries(sectorWiseStocks).map(([sector, stocks]) => (
                <div key={sector} className="space-y-6 w-full">
                    {/* Sector Title */}
                    <div className="my-2 text-sm font-semibold text-black bg-gray-100 border border-gray-300 px-6 py-3 rounded-md tracking-wide w-full">
                        {sector}
                    </div>

                    {/* Stock Cards */}
                    <div className="space-y-6 w-full">
                        {stocks.map((stock, index) => {
                            const investment =
                                (stock?.purchasePrice || 0) *
                                (stock?.quantity || 0);
                            const portfolioPercentage =
                                totalInvestment > 0
                                    ? (investment / totalInvestment) * 100
                                    : 0;
                            const gainLoss =
                                (stock?.presentValue || 0) - investment;
                            return (
                                <div
                                    key={index}
                                    className="flex flex-col bg-white p-8 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 w-full"
                                >
                                    {/* Stock Title */}
                                    <div>
                                        <div className="font-semibold text-xl text-gray-800">
                                            {stock.name}
                                        </div>
                                        {stock.code || stock.stockCode ? (
                                            <div className="text-xs text-gray-500 mt-1">
                                                Code:{" "}
                                                {stock.code || stock.stockCode}
                                            </div>
                                        ) : null}
                                    </div>

                                    {/* Stock Data */}
                                    <div className="grid grid-cols-2 gap-6 text-sm text-gray-700 mt-4">
                                        <div>
                                            <span className="text-xs text-gray-500">
                                                Buy Price
                                            </span>
                                            <div className="font-medium">
                                                {formatCurrency(
                                                    stock.purchasePrice
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-xs text-gray-500">
                                                Quantity
                                            </span>
                                            <div className="font-medium">
                                                {stock.quantity}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-xs text-gray-500">
                                                Investment
                                            </span>
                                            <div className="font-medium">
                                                {formatCurrency(investment)}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-xs text-gray-500">
                                                Portfolio %
                                            </span>
                                            <div className="font-medium">
                                                {formatPercentage(
                                                    portfolioPercentage
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-xs text-gray-500">
                                                Current Price
                                            </span>
                                            <div className="font-medium">
                                                {formatCurrency(
                                                    stock.currentPrice
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-xs text-gray-500">
                                                Current Value
                                            </span>
                                            <div className="font-medium">
                                                {formatCurrency(
                                                    stock.presentValue
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-xs text-gray-500">
                                                Gain/Loss
                                            </span>
                                            <div
                                                className={`font-medium ${
                                                    gainLoss >= 0
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }`}
                                            >
                                                {formatCurrency(gainLoss)}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-xs text-gray-500">
                                                P/E Ratio
                                            </span>
                                            <div className="font-medium">
                                                {formatNumber(stock.peRatio)}
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-xs text-gray-500">
                                                Latest Earnings
                                            </span>
                                            <div className="font-medium">
                                                {formatCurrency(
                                                    stock.latestEarnings
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Analyze Button */}
                                    <div className="flex justify-end mt-4">
                                        <AnalyzeButton
                                            onClick={() =>
                                                handleAnalyzeClick(
                                                    stock,
                                                    sector
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
            {selectedStock && isMobile ? (
                <StockChatMobileDrawer
                    stockData={selectedStock}
                    isOpen={isChatOpen}
                    onClose={() => {
                        setIsChatOpen(false);
                        setSelectedStock(null);
                        setSelectedSector(null);
                    }}
                />
            ) : (
                <StockAnalysisChat
                    stockData={selectedStock}
                    isOpen={isChatOpen}
                    onClose={() => {
                        setIsChatOpen(false);
                        setSelectedStock(null);
                        setSelectedSector(null);
                    }}
                />
            )}
        </div>
    );
};

export default StockTableMobile;
