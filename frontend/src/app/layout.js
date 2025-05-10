import { Inter } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "8Sapience",
    description: "Stock Portfolio Management System",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <LayoutWrapper>{children}</LayoutWrapper>
            </body>
        </html>
    );
}
