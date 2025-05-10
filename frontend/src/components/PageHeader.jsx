"use client";

import { useState, useEffect } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { useIsMobile } from "@/hooks/useIsMobile";

const PageHeader = ({ title, onSearch }) => {
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const isMobile = useIsMobile();

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                document.getElementById("stock-search")?.focus();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        onSearch?.(value);
    };

    return (
        <div className="mb-1 border-b border-gray-200">
            <div className="flex items-center justify-between">
                <h1
                    className={`${
                        isMobile ? "text-lg" : "text-xl"
                    } font-semibold text-gray-900`}
                >
                    {title}
                </h1>
                {title === "Dashboard" && (
                    <div
                        className={`relative ${
                            isMobile ? "w-48" : "max-w-md w-96"
                        } mb-2`}
                    >
                        <div
                            className={`flex items-center gap-2 ${
                                isMobile ? "px-3 py-2" : "px-4 py-2.5"
                            } bg-gray-50 border rounded-lg transition-all ${
                                isSearchFocused
                                    ? "border-gray-400 bg-white ring-2 ring-gray-100"
                                    : "border-gray-200 hover:border-gray-300"
                            }`}
                        >
                            <HiMagnifyingGlass className="w-5 h-5 text-gray-400" />
                            <input
                                id="stock-search"
                                type="text"
                                className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-gray-400"
                                placeholder={
                                    isMobile
                                        ? "Search by name..."
                                        : "Search stocks by name..."
                                }
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                            />
                            {!isMobile && (
                                <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded border border-gray-200 bg-white text-xs text-gray-400">
                                    <span className="text-xs">Ctrl</span>
                                    <span>K</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PageHeader;
