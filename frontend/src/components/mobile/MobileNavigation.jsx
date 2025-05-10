"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    IoMdHome,
    IoMdAnalytics,
    IoMdCart,
    IoMdMore,
    IoMdCash,
    IoMdPerson,
    IoMdHelpCircle,
    IoMdLogOut,
} from "react-icons/io";

const primaryItems = [
    { label: "Dashboard", icon: IoMdHome, path: "/" },
    { label: "Analytics", icon: IoMdAnalytics, path: "/analytics" },
    { label: "Purchase", icon: IoMdCart, path: "/purchase" },
];

const moreItems = [
    { label: "Budget", icon: IoMdCash, path: "/budget" },
    { label: "Account", icon: IoMdPerson, path: "/account" },
    { label: "Help", icon: IoMdHelpCircle, path: "/help" },
    { label: "Logout", icon: IoMdLogOut, path: "/logout" },
];

const MobileNavigation = () => {
    const pathname = usePathname();
    const [showMore, setShowMore] = useState(false);

    const NavItem = ({ item }) => {
        const isActive = pathname === item.path;
        return (
            <Link href={item.path} onClick={() => setShowMore(false)}>
                <div
                    className={`flex flex-col items-center text-xs gap-1 ${
                        isActive ? "text-blue-500" : "text-gray-400"
                    }`}
                >
                    <item.icon size={24} />
                    <span>{item.label}</span>
                </div>
            </Link>
        );
    };

    return (
        <>
            {/* Bottom Nav Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-gray-700 p-2 flex justify-around items-center z-50">
                {primaryItems.map((item) => (
                    <NavItem key={item.label} item={item} />
                ))}
                <button
                    onClick={() => setShowMore(!showMore)}
                    className="flex flex-col items-center text-xs gap-1 text-gray-400"
                >
                    <IoMdMore size={24} />
                    <span>More</span>
                </button>
            </div>

            {/* More Menu Overlay */}
            {showMore && (
                <div className="absolute bottom-16 right-4 bg-[#2a2a2a] text-white rounded-lg shadow-lg p-3 z-50 w-48">
                    <div className="flex flex-col gap-2">
                        {moreItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.path}
                                onClick={() => setShowMore(false)}
                                className="flex items-center gap-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-md px-2 py-2 transition-all"
                            >
                                <item.icon size={18} />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default MobileNavigation;
