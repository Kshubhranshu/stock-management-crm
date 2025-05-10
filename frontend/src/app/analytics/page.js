"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import { getStockPurchaseSummary } from "@/services/stockService";
import { HiCurrencyDollar, HiCube } from "react-icons/hi";

export default function Analytics() {
    const [summary, setSummary] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSummary = async () => {
        try {
            const data = await getStockPurchaseSummary();
            setSummary(data);
            setError(null);
        } catch (err) {
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSummary();
    }, []);

    if (isLoading) {
        return (
            <div className="p-8">
                <PageHeader title="Analytics" />
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <PageHeader title="Analytics" />
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <PageHeader title="Analytics" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Total Investment Card */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Total Investment
                            </p>
                            <p className="text-2xl font-semibold text-gray-900 mt-1">
                                ₹
                                {summary?.totalInvestment?.toLocaleString(
                                    "en-IN",
                                    { maximumFractionDigits: 2 }
                                ) || 0}
                            </p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-full">
                            <HiCurrencyDollar className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                {/* Total Quantity Card */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Total Quantity
                            </p>
                            <p className="text-2xl font-semibold text-gray-900 mt-1">
                                {summary?.totalQuantity?.toLocaleString() || 0}
                            </p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-full">
                            <HiCube className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Sector-wise Breakdown */}
            {summary?.sectorWise &&
            Object.keys(summary.sectorWise).length > 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Sector-wise Breakdown
                    </h3>
                    <div className="space-y-4">
                        {Object.entries(summary.sectorWise).map(
                            ([sector, data]) => (
                                <div
                                    key={sector}
                                    className="border-b border-gray-100 pb-4 last:border-0"
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {sector}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Quantity:{" "}
                                                {data.quantity.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900">
                                                ₹
                                                {data.investment.toLocaleString(
                                                    "en-IN",
                                                    { maximumFractionDigits: 2 }
                                                )}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {(
                                                    (data.investment /
                                                        summary.totalInvestment) *
                                                    100
                                                ).toFixed(1)}
                                                % of portfolio
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <p className="text-gray-500 text-center">
                        No sector data available
                    </p>
                </div>
            )}
        </div>
    );
}
