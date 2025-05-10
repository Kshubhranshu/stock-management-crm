"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import {
    HiMagnifyingGlass,
    HiChevronUpDown,
    HiChevronUp,
    HiChevronDown,
} from "react-icons/hi2";
import { searchStocks, purchaseStock } from "@/services/stockService";
import toast from "react-hot-toast";
import { scrollToElement } from "@/utils/scrollToElement";

export default function PurchaseStock() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedStock, setSelectedStock] = useState(null);
    const [quantity, setQuantity] = useState("");
    const [purchasePrice, setPurchasePrice] = useState("");
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "ascending",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [error, setError] = useState(null);
    const [lastSearchQuery, setLastSearchQuery] = useState("");
    const [showManualForm, setShowManualForm] = useState(false);
    const [manualStock, setManualStock] = useState({
        name: "",
        stockCode: "",
        sector: "",
        stockExchange: "",
        purchasePrice: "",
        quantity: "",
    });

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        // Check if the search query is the same as the last one (case-insensitive)
        if (searchQuery.toLowerCase() === lastSearchQuery.toLowerCase()) {
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const response = await searchStocks(searchQuery);
            if (response.status === "success") {
                // Check if data is a string (error message) or array (stocks)
                if (typeof response.data === "string") {
                    setSearchResults([]);
                    setError(response.data);
                } else {
                    // Filter only equity stocks and format the data
                    const formattedResults = response.data
                        .filter((stock) => stock.quoteType === "EQUITY")
                        .map((stock) => ({
                            symbol: stock.symbol,
                            name: stock.shortname,
                            fullName: stock.longname,
                            exchange: stock.exchDisp,
                            sector:
                                stock.sectorDisp || stock.sector || "Others",
                        }));
                    setSearchResults(formattedResults);
                    setLastSearchQuery(searchQuery);
                }
            } else {
                setError("Failed to fetch stocks. Please try again.");
            }
        } catch (err) {
            setError("Failed to fetch stocks. Please try again.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePurchase = (stock) => {
        setSelectedStock(stock);
        setShowManualForm(false);
        setPurchasePrice("");
        scrollToElement("purchase-section");
    };

    const handleManualPurchase = async (e) => {
        e.preventDefault();
        const {
            name,
            stockCode,
            sector,
            stockExchange,
            purchasePrice,
            quantity,
        } = manualStock;

        if (
            !name ||
            !stockCode ||
            !sector ||
            !stockExchange ||
            !purchasePrice ||
            !quantity
        ) {
            setError("Please fill in all fields");
            return;
        }

        setIsPurchasing(true);
        setError(null);
        try {
            const stockData = {
                name,
                sector,
                stockCode: stockCode.toUpperCase(),
                purchasePrice: parseFloat(purchasePrice),
                quantity: parseInt(quantity),
                stockExchange,
            };

            const response = await purchaseStock(stockData);
            if (response.status === "success") {
                // Reset form and show success message
                setManualStock({
                    name: "",
                    stockCode: "",
                    sector: "",
                    stockExchange: "",
                    purchasePrice: "",
                    quantity: "",
                });
                setShowManualForm(false);
                toast.success("Stock purchased successfully!");
            }
        } catch (err) {
            setError("Failed to purchase stock. Please try again.");
        } finally {
            setIsPurchasing(false);
        }
    };

    const handleSubmitPurchase = async (e) => {
        e.preventDefault();
        if (!purchasePrice || !quantity) {
            setError("Please enter both quantity and purchase price");
            return;
        }

        setIsPurchasing(true);
        setError(null);
        try {
            const stockData = {
                name: selectedStock.name,
                sector: selectedStock.sector,
                stockCode: selectedStock.symbol.toUpperCase(),
                purchasePrice: parseFloat(purchasePrice),
                quantity: parseInt(quantity),
                stockExchange: selectedStock.exchange,
            };

            const response = await purchaseStock(stockData);
            if (response.status === "success") {
                // Reset form and show success message
                setSelectedStock(null);
                setQuantity("");
                setPurchasePrice("");
                toast.success("Stock purchased successfully!");
            }
        } catch (err) {
        } finally {
            setIsPurchasing(false);
        }
    };

    const sortData = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };

    const getSortedData = () => {
        if (!sortConfig.key) return searchResults;

        return [...searchResults].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === "ascending" ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === "ascending" ? 1 : -1;
            }
            return 0;
        });
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

    return (
        <div className="p-8">
            <PageHeader title="Purchase Stock" />

            <div className="max-w-4xl mx-auto">
                {/* Toggle Buttons */}
                <div className="mb-8 flex gap-4">
                    <button
                        onClick={() => {
                            setShowManualForm(false);
                            setSelectedStock(null);
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            !showManualForm
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        Search & Purchase
                    </button>
                    <button
                        onClick={() => {
                            setShowManualForm(true);
                            setSelectedStock(null);
                            setSearchResults([]);
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            showManualForm
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        Manual Entry
                    </button>
                </div>

                {!showManualForm ? (
                    <>
                        {/* Search Section */}
                        <div className="mb-8">
                            <form onSubmit={handleSearch} className="relative">
                                <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg hover:border-gray-300 transition-all">
                                    <HiMagnifyingGlass className="w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-gray-400"
                                        placeholder="Search for stocks..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                    />
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors ${
                                            isLoading
                                                ? "opacity-50 cursor-not-allowed"
                                                : ""
                                        }`}
                                    >
                                        {isLoading ? "Searching..." : "Search"}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        {/* Search Results Table */}
                        {isLoading ? (
                            <div className="flex justify-center items-center p-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : searchResults.length > 0 ? (
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-8">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th
                                                    onClick={() =>
                                                        sortData("symbol")
                                                    }
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                >
                                                    Symbol
                                                    <SortIcon columnKey="symbol" />
                                                </th>
                                                <th
                                                    onClick={() =>
                                                        sortData("name")
                                                    }
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                >
                                                    Stock Name
                                                    <SortIcon columnKey="name" />
                                                </th>
                                                <th
                                                    onClick={() =>
                                                        sortData("fullName")
                                                    }
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                >
                                                    Full Name
                                                    <SortIcon columnKey="fullName" />
                                                </th>
                                                <th
                                                    onClick={() =>
                                                        sortData("exchange")
                                                    }
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                >
                                                    Exchange
                                                    <SortIcon columnKey="exchange" />
                                                </th>
                                                <th
                                                    onClick={() =>
                                                        sortData("sector")
                                                    }
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                >
                                                    Sector
                                                    <SortIcon columnKey="sector" />
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {getSortedData().map((stock) => (
                                                <tr
                                                    key={stock.symbol}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {stock.symbol}
                                                    </td>
                                                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <span
                                                            className="truncate max-w-[150px] block"
                                                            title={stock.name}
                                                        >
                                                            {stock.name}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <span
                                                            className="truncate max-w-[250px] block"
                                                            title={
                                                                stock.fullName
                                                            }
                                                        >
                                                            {stock.fullName}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {stock.exchange}
                                                    </td>
                                                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <span
                                                            className="truncate max-w-[150px] block"
                                                            title={stock.sector}
                                                        >
                                                            {stock.sector}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button
                                                            onClick={() =>
                                                                handlePurchase(
                                                                    stock
                                                                )
                                                            }
                                                            className="text-blue-600 hover:text-blue-900 cursor-pointer"
                                                        >
                                                            Buy
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            searchQuery &&
                            !isLoading && (
                                <div className="text-center py-8 text-gray-500">
                                    No stocks found matching your search.
                                </div>
                            )
                        )}
                    </>
                ) : (
                    /* Manual Purchase Form */
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                        <h2 className="text-lg font-semibold mb-6">
                            Manual Stock Entry
                        </h2>
                        <form
                            onSubmit={handleManualPurchase}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Stock Name
                                    </label>
                                    <input
                                        type="text"
                                        value={manualStock.name}
                                        onChange={(e) =>
                                            setManualStock({
                                                ...manualStock,
                                                name: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="Enter stock name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Stock Code
                                    </label>
                                    <input
                                        type="text"
                                        value={manualStock.stockCode}
                                        onChange={(e) =>
                                            setManualStock({
                                                ...manualStock,
                                                stockCode:
                                                    e.target.value.toUpperCase(),
                                            })
                                        }
                                        onBlur={(e) => {
                                            setManualStock({
                                                ...manualStock,
                                                stockCode: e.target.value
                                                    .trim()
                                                    .toUpperCase(),
                                            });
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 uppercase"
                                        placeholder="e.g., AAPL, GOOGL"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Sector
                                    </label>
                                    <input
                                        type="text"
                                        value={manualStock.sector}
                                        onChange={(e) =>
                                            setManualStock({
                                                ...manualStock,
                                                sector: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="e.g., Technology, Healthcare"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Stock Exchange
                                    </label>
                                    <select
                                        value={manualStock.stockExchange}
                                        onChange={(e) =>
                                            setManualStock({
                                                ...manualStock,
                                                stockExchange: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    >
                                        <option value="">
                                            Select Exchange
                                        </option>
                                        <option value="NSE">NSE</option>
                                        <option value="BSE">BSE</option>
                                        <option value="NYSE">NYSE</option>
                                        <option value="NASDAQ">NASDAQ</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Purchase Price
                                    </label>
                                    <input
                                        type="number"
                                        value={manualStock.purchasePrice}
                                        onChange={(e) =>
                                            setManualStock({
                                                ...manualStock,
                                                purchasePrice: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="Enter price"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Quantity
                                    </label>
                                    <input
                                        type="number"
                                        value={manualStock.quantity}
                                        onChange={(e) =>
                                            setManualStock({
                                                ...manualStock,
                                                quantity: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="Enter quantity"
                                        min="1"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-600">
                                        {error}
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isPurchasing}
                                    className={`px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors ${
                                        isPurchasing
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    }`}
                                >
                                    {isPurchasing
                                        ? "Purchasing..."
                                        : "Purchase Stock"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Purchase Form for searched stock */}
                {selectedStock && !showManualForm && (
                    <div
                        id="purchase-section"
                        className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
                    >
                        <h2 className="text-lg font-semibold mb-6">
                            Purchase Details
                        </h2>
                        <form
                            onSubmit={handleSubmitPurchase}
                            className="space-y-6"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Selected Stock
                                </label>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-medium text-gray-900">
                                        {selectedStock.fullName}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {selectedStock.symbol} -{" "}
                                        {selectedStock.exchange}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Sector: {selectedStock.sector}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Quantity
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        placeholder="Enter quantity"
                                        value={quantity}
                                        onChange={(e) =>
                                            setQuantity(e.target.value)
                                        }
                                        required
                                        min="1"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Purchase Price (₹)
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        placeholder="Enter price"
                                        value={purchasePrice}
                                        onChange={(e) =>
                                            setPurchasePrice(e.target.value)
                                        }
                                        required
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isPurchasing}
                                    className={`w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors ${
                                        isPurchasing
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    }`}
                                >
                                    {isPurchasing
                                        ? "Purchasing..."
                                        : "Purchase Stock"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
