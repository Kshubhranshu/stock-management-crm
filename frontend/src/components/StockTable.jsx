"use client";

import { useState } from "react";
import { HiChevronUpDown, HiChevronUp, HiChevronDown } from "react-icons/hi2";
import React from "react";
import StockAnalysisChat from "./StockAnalysisChat";
import AnalyzeButton from "./AnalyzeButton";

const StockTable = ({ sectorWiseStocks }) => {
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "ascending",
    });
    const [selectedStock, setSelectedStock] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [selectedSector, setSelectedSector] = useState(null);

    const sortData = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };

    const formatNumber = (number, decimals = 2) => {
        if (
            number === 0 ||
            number === null ||
            number === undefined ||
            isNaN(number)
        ) {
            return "N/A";
        }
        return number.toLocaleString("en-IN", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        });
    };

    const formatPercentage = (number) => {
        if (
            number === 0 ||
            number === null ||
            number === undefined ||
            isNaN(number)
        ) {
            return "N/A";
        }
        return `${formatNumber(number, 2)}%`;
    };

    const formatCurrency = (number) => {
        if (
            number === 0 ||
            number === null ||
            number === undefined ||
            isNaN(number)
        ) {
            return "N/A";
        }
        return `₹${formatNumber(number)}`;
    };

    const SortIcon = ({ columnKey }) => {
        if (sortConfig.key !== columnKey) {
            return (
                <HiChevronUpDown className="inline-block ml-1 -mt-1 text-gray-400 w-4 h-4" />
            );
        }
        return sortConfig.direction === "ascending" ? (
            <HiChevronUp className="inline-block ml-1 -mt-1 text-blue-500 w-4 h-4" />
        ) : (
            <HiChevronDown className="inline-block ml-1 -mt-1 text-blue-500 w-4 h-4" />
        );
    };

    const calculateSectorTotals = (stocks) => {
        return stocks.reduce(
            (acc, stock) => ({
                quantity: acc.quantity + stock.quantity,
                investment: acc.investment + stock.investment,
                presentValue: acc.presentValue + stock.presentValue,
                gainLoss: acc.gainLoss + stock.gainLoss,
            }),
            {
                quantity: 0,
                investment: 0,
                presentValue: 0,
                gainLoss: 0,
            }
        );
    };

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

    if (!sectorWiseStocks || Object.keys(sectorWiseStocks || {}).length === 0) {
        return (
            <div className="p-8 text-center text-gray-500">
                No stocks data available
            </div>
        );
    }

    // Calculate total investment for portfolio percentage with optional chaining
    const totalInvestment =
        Object.values(sectorWiseStocks || {})?.reduce(
            (total, stocks) =>
                total +
                (stocks?.reduce(
                    (sectorTotal, stock) =>
                        sectorTotal +
                        (stock?.purchasePrice || 0) * (stock?.quantity || 0),
                    0
                ) || 0),
            0
        ) || 0;

    // Update portfolio percentages with optional chaining
    const sectorsWithPercentages =
        Object.entries(sectorWiseStocks || {})?.map(([sector, stocks]) => ({
            sector,
            stocks:
                stocks?.map((stock) => ({
                    ...stock,
                    investment:
                        (stock?.purchasePrice || 0) * (stock?.quantity || 0),
                    portfolioPercentage:
                        totalInvestment > 0
                            ? (((stock?.purchasePrice || 0) *
                                  (stock?.quantity || 0)) /
                                  totalInvestment) *
                              100
                            : 0,
                })) || [],
        })) || [];

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th
                            onClick={() => sortData("stockName")}
                            className="group px-6 py-4 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                        >
                            <div className="flex items-center">
                                Stock Name
                                <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <SortIcon columnKey="stockName" />
                                </span>
                            </div>
                        </th>
                        <th
                            onClick={() => sortData("purchasePrice")}
                            className="group px-6 py-4 text-right text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                        >
                            <div className="flex items-center justify-end">
                                Purchase Price
                                <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <SortIcon columnKey="purchasePrice" />
                                </span>
                            </div>
                        </th>
                        <th
                            onClick={() => sortData("quantity")}
                            className="group px-6 py-4 text-right text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                        >
                            <div className="flex items-center justify-end">
                                Quantity
                                <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <SortIcon columnKey="quantity" />
                                </span>
                            </div>
                        </th>
                        <th
                            onClick={() => sortData("investment")}
                            className="group px-6 py-4 text-right text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                        >
                            <div className="flex items-center justify-end">
                                Investment
                                <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <SortIcon columnKey="investment" />
                                </span>
                            </div>
                        </th>
                        <th
                            onClick={() => sortData("portfolioPercentage")}
                            className="group px-6 py-4 text-right text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                        >
                            <div className="flex items-center justify-end">
                                Portfolio %
                                <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <SortIcon columnKey="portfolioPercentage" />
                                </span>
                            </div>
                        </th>
                        <th
                            onClick={() => sortData("code")}
                            className="group px-6 py-4 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                        >
                            <div className="flex items-center">
                                NSE/BSE Code
                                <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <SortIcon columnKey="code" />
                                </span>
                            </div>
                        </th>
                        <th
                            onClick={() => sortData("currentPrice")}
                            className="group px-6 py-4 text-right text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                        >
                            <div className="flex items-center justify-end">
                                CMP
                                <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <SortIcon columnKey="currentPrice" />
                                </span>
                            </div>
                        </th>
                        <th
                            onClick={() => sortData("presentValue")}
                            className="group px-6 py-4 text-right text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                        >
                            <div className="flex items-center justify-end">
                                Present Value
                                <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <SortIcon columnKey="presentValue" />
                                </span>
                            </div>
                        </th>
                        <th
                            onClick={() => sortData("gainLoss")}
                            className="group px-6 py-4 text-right text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                        >
                            <div className="flex items-center justify-end">
                                Gain/Loss
                                <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <SortIcon columnKey="gainLoss" />
                                </span>
                            </div>
                        </th>
                        <th
                            onClick={() => sortData("peRatio")}
                            className="group px-6 py-4 text-right text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                        >
                            <div className="flex items-center justify-end">
                                P/E Ratio
                                <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <SortIcon columnKey="peRatio" />
                                </span>
                            </div>
                        </th>
                        <th
                            onClick={() => sortData("latestEarnings")}
                            className="group px-6 py-4 text-right text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                        >
                            <div className="flex items-center justify-end">
                                Latest Earnings
                                <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <SortIcon columnKey="latestEarnings" />
                                </span>
                            </div>
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {sectorsWithPercentages?.map(({ sector, stocks }) => (
                        <React.Fragment key={sector}>
                            {/* Sector Header Row */}
                            <tr className="bg-gray-800 text-white">
                                <td
                                    colSpan={3}
                                    className="px-6 py-3 text-sm font-semibold"
                                >
                                    {sector} ({stocks?.length || 0} Stocks)
                                </td>
                                {(() => {
                                    const totals = calculateSectorTotals(
                                        stocks || []
                                    );
                                    return (
                                        <>
                                            <td className="px-6 py-3 text-sm font-semibold text-right">
                                                {formatCurrency(
                                                    totals?.investment
                                                )}
                                            </td>
                                            <td className="px-6 py-3 text-sm font-semibold text-right">
                                                {formatPercentage(
                                                    stocks?.reduce(
                                                        (sum, stock) =>
                                                            sum +
                                                            (stock?.portfolioPercentage ||
                                                                0),
                                                        0
                                                    ) || 0
                                                )}
                                            </td>
                                            <td className="px-6 py-3"></td>
                                            <td className="px-6 py-3"></td>
                                            <td className="px-6 py-3 text-sm font-semibold text-right">
                                                {formatCurrency(
                                                    totals?.presentValue
                                                )}
                                            </td>
                                            <td
                                                className={`px-6 py-3 text-sm font-semibold text-right ${
                                                    totals?.gainLoss >= 0
                                                        ? "text-green-400"
                                                        : "text-red-400"
                                                }`}
                                            >
                                                {formatCurrency(
                                                    totals?.presentValue -
                                                        totals?.investment
                                                )}
                                            </td>
                                            <td className="px-6 py-3"></td>
                                            <td className="px-6 py-3"></td>
                                        </>
                                    );
                                })()}
                                <td className="px-6 py-3"></td>
                            </tr>
                            {/* Stock Rows */}
                            {stocks?.map((stock) => (
                                <tr
                                    key={stock?._id}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                        {stock?.name || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 text-right">
                                        {formatCurrency(stock?.purchasePrice)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 text-right">
                                        {formatNumber(stock?.quantity, 0)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 text-right">
                                        {formatCurrency(stock?.investment)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 text-right">
                                        {formatPercentage(
                                            stock?.portfolioPercentage
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {stock?.stockCode || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 text-right">
                                        {formatCurrency(stock?.currentPrice)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 text-right">
                                        {formatCurrency(stock?.presentValue)}
                                    </td>
                                    <td
                                        className={`px-6 py-4 text-sm text-right ${
                                            (stock?.presentValue || 0) -
                                                (stock?.investment || 0) >=
                                            0
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {formatCurrency(
                                            (stock?.presentValue || 0) -
                                                (stock?.investment || 0)
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 text-right">
                                        {formatNumber(stock?.peRatio)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 text-right">
                                        {stock?.latestEarnings || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm text-gray-600">
                                        <AnalyzeButton
                                            onClick={() =>
                                                handleAnalyzeClick(
                                                    stock,
                                                    sector
                                                )
                                            }
                                        />
                                    </td>
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                    {/* Grand Total Row */}
                    <tr className="bg-gray-900 text-white font-semibold">
                        <td colSpan={3} className="px-6 py-4 text-sm">
                            Total (
                            {Object.values(sectorWiseStocks || {})?.reduce(
                                (sum, stocks) => sum + (stocks?.length || 0),
                                0
                            )}{" "}
                            Stocks)
                        </td>
                        <td className="px-6 py-4 text-sm text-right">
                            {formatCurrency(totalInvestment)}
                        </td>
                        <td className="px-6 py-4 text-sm text-right">
                            {totalInvestment > 0
                                ? formatPercentage(100)
                                : "N/A"}
                        </td>
                        <td className="px-6 py-4"></td>
                        <td className="px-6 py-4 text-sm text-right">
                            {formatCurrency(totalInvestment)}
                        </td>
                        <td className="px-6 py-4 text-sm text-right">
                            {formatCurrency(totalInvestment)}
                        </td>
                        <td className="px-6 py-4 text-sm text-right text-gray-400">
                            N/A
                        </td>
                        <td className="px-6 py-4 text-sm text-right">N/A</td>
                        <td className="px-6 py-4 text-sm text-right">N/A</td>
                        <td className="px-6 py-4"></td>
                    </tr>
                </tbody>
            </table>
            {selectedStock && (
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

export default StockTable;
