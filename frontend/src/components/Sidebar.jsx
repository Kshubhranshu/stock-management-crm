"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    IoMdHome,
    IoMdAnalytics,
    IoMdCash,
    IoMdHelpCircle,
    IoMdLogOut,
    IoMdArrowBack,
    IoMdArrowForward,
    IoMdPerson,
    IoMdCart,
} from "react-icons/io";

const menuItems = [
    { id: 1, label: "Dashboard", icon: IoMdHome, path: "/" },
    { id: 2, label: "Analytics", icon: IoMdAnalytics, path: "/analytics" },
    { id: 3, label: "Budget", icon: IoMdCash, path: "/budget" },
    { id: 4, label: "Purchase Stock", icon: IoMdCart, path: "/purchase" },
];

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isLogoutHovered, setIsLogoutHovered] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        if (typeof window === "undefined") return;

        const isMobile = window.innerWidth < 768;
        if (isMobile) return;

        const main = document.querySelector("main");
        if (main) {
            main.style.marginLeft = isCollapsed ? "5rem" : "16rem";
        }
    }, [isCollapsed]);

    const NavItem = ({ item }) => {
        const isActive = pathname === item.path;
        return (
            <Link href={item.path}>
                <div
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-all
                    ${
                        isActive
                            ? "bg-blue-600 text-white"
                            : "text-gray-300 hover:bg-gray-800"
                    }`}
                >
                    <item.icon size={22} className="min-w-[22px]" />
                    {!isCollapsed && (
                        <span className="ml-3 text-sm font-medium">
                            {item.label}
                        </span>
                    )}
                </div>
            </Link>
        );
    };

    return (
        <div
            className={`fixed left-0 top-0 h-screen bg-[#1a1a1a] transition-all duration-300 ease-in-out
      ${isCollapsed ? "w-20" : "w-64"} shadow-xl`}
        >
            {/* Sidebar Header */}
            <div className="sticky top-0 p-4 bg-[#2a2a2a] border-b border-gray-700 flex justify-between items-center">
                {!isCollapsed && (
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">
                                8
                            </span>
                        </div>
                        <h1 className="text-white text-lg font-semibold ml-3">
                            Sapience
                        </h1>
                    </div>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
                    title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {isCollapsed ? (
                        <IoMdArrowForward size={20} />
                    ) : (
                        <IoMdArrowBack size={20} />
                    )}
                </button>
            </div>

            {/* Sidebar Content */}
            <div className="py-4 flex flex-col h-[calc(100vh-144px)] overflow-y-auto">
                {/* Main Navigation */}
                <div className="px-3 py-2">
                    {!isCollapsed && (
                        <p className="text-xs font-semibold text-gray-400 uppercase mb-4 px-3">
                            Main Menu
                        </p>
                    )}
                    <nav className="space-y-1">
                        {menuItems.map((item) => (
                            <NavItem key={item.id} item={item} />
                        ))}
                    </nav>
                </div>

                {/* Support Section */}
                <div className="mt-auto px-3 py-2">
                    {!isCollapsed && (
                        <p className="text-xs font-semibold text-gray-400 uppercase mb-4 px-3">
                            Support
                        </p>
                    )}
                    <nav className="space-y-1">
                        <Link href="/account">
                            <div className="flex items-center p-3 rounded-lg cursor-pointer text-gray-300 hover:bg-gray-800 transition-all">
                                <IoMdPerson
                                    size={22}
                                    className="min-w-[22px]"
                                />
                                {!isCollapsed && (
                                    <span className="ml-3 text-sm font-medium">
                                        Account
                                    </span>
                                )}
                            </div>
                        </Link>
                        <Link href="/help">
                            <div className="flex items-center p-3 rounded-lg cursor-pointer text-gray-300 hover:bg-gray-800 transition-all">
                                <IoMdHelpCircle
                                    size={22}
                                    className="min-w-[22px]"
                                />
                                {!isCollapsed && (
                                    <span className="ml-3 text-sm font-medium">
                                        Help Center
                                    </span>
                                )}
                            </div>
                        </Link>
                    </nav>
                </div>
            </div>

            {/* Sidebar Footer */}
            <div className="absolute bottom-0 w-full p-4 bg-[#2a2a2a] border-t border-gray-700">
                <div
                    className="flex items-center cursor-pointer text-gray-300 hover:text-white transition-colors"
                    onMouseEnter={() => setIsLogoutHovered(true)}
                    onMouseLeave={() => setIsLogoutHovered(false)}
                >
                    <IoMdLogOut size={22} className="min-w-[22px]" />
                    {!isCollapsed && (
                        <div className="flex items-center">
                            <span className="ml-3 text-sm font-medium">
                                Logout
                            </span>
                            <span className="ml-2 transition-opacity flex items-center gap-1">
                                {isLogoutHovered ? "☹️📉" : "☺️📈"}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
