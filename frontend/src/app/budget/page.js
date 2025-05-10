"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { HiCurrencyDollar, HiCalendar, HiChartBar } from "react-icons/hi";

// Dummy data for stock purchasing budgets
const dummyData = {
    yearly: {
        budget: 5000000,
        spent: 3500000,
        remaining: 1500000,
        categories: [
            {
                name: "Large Cap",
                budget: 2000000,
                spent: 1500000,
                percentage: 75,
            },
            {
                name: "Mid Cap",
                budget: 1500000,
                spent: 1000000,
                percentage: 67,
            },
            {
                name: "Small Cap",
                budget: 1000000,
                spent: 600000,
                percentage: 60,
            },
            {
                name: "Sector Funds",
                budget: 500000,
                spent: 400000,
                percentage: 80,
            },
        ],
    },
    monthly: {
        budget: 500000,
        spent: 350000,
        remaining: 150000,
        categories: [
            {
                name: "Large Cap",
                budget: 200000,
                spent: 150000,
                percentage: 75,
            },
            { name: "Mid Cap", budget: 150000, spent: 100000, percentage: 67 },
            { name: "Small Cap", budget: 100000, spent: 60000, percentage: 60 },
            {
                name: "Sector Funds",
                budget: 50000,
                spent: 40000,
                percentage: 80,
            },
        ],
    },
};

export default function Budget() {
    const [view, setView] = useState("yearly"); // 'yearly' or 'monthly'

    const data = view === "yearly" ? dummyData.yearly : dummyData.monthly;

    return (
        <div className="p-8">
            <PageHeader title="Investment Budget" />

            {/* View Toggle */}
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setView("yearly")}
                    className={`px-4 py-2 rounded-lg ${
                        view === "yearly"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-600"
                    }`}
                >
                    Yearly
                </button>
                <button
                    onClick={() => setView("monthly")}
                    className={`px-4 py-2 rounded-lg ${
                        view === "monthly"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-600"
                    }`}
                >
                    Monthly
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Budget Card */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Total Investment Budget
                            </p>
                            <p className="text-2xl font-semibold text-gray-900 mt-1">
                                ₹{data.budget.toLocaleString("en-IN")}
                            </p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-full">
                            <HiCurrencyDollar className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                {/* Spent Card */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Amount Invested
                            </p>
                            <p className="text-2xl font-semibold text-gray-900 mt-1">
                                ₹{data.spent.toLocaleString("en-IN")}
                            </p>
                        </div>
                        <div className="p-3 bg-red-50 rounded-full">
                            <HiChartBar className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>

                {/* Remaining Card */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Available for Investment
                            </p>
                            <p className="text-2xl font-semibold text-gray-900 mt-1">
                                ₹{data.remaining.toLocaleString("en-IN")}
                            </p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-full">
                            <HiCalendar className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Investment Category Breakdown
                </h3>
                <div className="space-y-4">
                    {data.categories.map((category) => (
                        <div
                            key={category.name}
                            className="border-b border-gray-100 pb-4 last:border-0"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-sm font-medium text-gray-900">
                                    {category.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                    ₹{category.spent.toLocaleString("en-IN")} /
                                    ₹{category.budget.toLocaleString("en-IN")}
                                </p>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${category.percentage}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                {category.percentage}% allocated
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
