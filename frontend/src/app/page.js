"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import StockTable from "@/components/StockTable";
import StockTableMobile from "@/components/mobile/StockTableMobile";
import { getSectorWiseStocks } from "@/services/stockService";
import toast from "react-hot-toast";

export default function Home() {
    const [sectorWiseStocks, setSectorWiseStocks] = useState([]);
    const [filteredStocks, setFilteredStocks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        fetchSectorWiseStocks();
    }, []);

    useEffect(() => {
        if (sectorWiseStocks && Object.keys(sectorWiseStocks).length > 0) {
            filterStocks(searchQuery);
        }
    }, [searchQuery, sectorWiseStocks]);

    const fetchSectorWiseStocks = async () => {
        try {
            const response = await getSectorWiseStocks();
            if (response.status === "success") {
                setSectorWiseStocks(response.data);
                setFilteredStocks(response.data);
            }
        } catch (error) {
            toast.error("Error fetching sector-wise stocks");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const filterStocks = (query) => {
        if (!query.trim()) {
            setFilteredStocks(sectorWiseStocks);
            return;
        }

        const filtered = {};
        Object.entries(sectorWiseStocks).forEach(([sector, stocks]) => {
            const filteredStocks = stocks.filter(
                (stock) =>
                    stock.name?.toLowerCase().includes(query.toLowerCase()) ||
                    stock.stockCode?.toLowerCase().includes(query.toLowerCase())
            );
            if (filteredStocks.length > 0) {
                filtered[sector] = filteredStocks;
            }
        });
        setFilteredStocks(filtered);
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    return (
        <div className="h-full">
            {/* Header Section */}
            <div
                className={`fixed top-0 ${
                    isMobile ? "left-0" : "left-64"
                } right-0 bg-white z-10`}
            >
                <div className={`${isMobile ? "p-4 pb-0" : "p-8 pb-0"}`}>
                    <PageHeader title="Dashboard" onSearch={handleSearch} />
                </div>
            </div>

            {/* Content Section */}
            <div className={`${isMobile ? "pt-20 p-4" : "pt-24 p-8"}`}>
                <div className="flex flex-col bg-white p-0 rounded-lg border-none shadow-none sm:border sm:border-gray-200 sm:shadow-sm sm:hover:shadow-md transition-shadow duration-200">
                    {isLoading ? (
                        <div
                            className={`${
                                isMobile ? "p-4" : "p-8"
                            } flex justify-center items-center`}
                        >
                            Loading stocks data...
                        </div>
                    ) : isMobile ? (
                        <StockTableMobile sectorWiseStocks={filteredStocks} />
                    ) : (
                        <StockTable sectorWiseStocks={filteredStocks} />
                    )}
                </div>
            </div>
        </div>
    );
}
