"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "react-hot-toast";
import MobileNavigation from "@/components/mobile/MobileNavigation";

const LayoutWrapper = ({ children }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="flex min-h-screen">
            {/* Sidebar - Hidden on mobile, visible on desktop */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            <main className="flex-1 md:ml-64 pb-16 md:pb-0">{children}</main>

            {/* Mobile Navigation - Visible on mobile, hidden on desktop */}
            {mounted && (
                <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
                    <MobileNavigation />
                </div>
            )}
            <Toaster position="top-right" />
        </div>
    );
};

export default LayoutWrapper;
