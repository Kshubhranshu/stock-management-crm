import React from "react";
import {
    HiX,
    HiPaperAirplane,
    HiOutlineLightBulb,
    HiChevronDown,
    HiChevronUp,
} from "react-icons/hi";
import { Line } from "react-chartjs-2";
import { motion, AnimatePresence } from "framer-motion";

const StockChatMobileDrawer = ({ isOpen, onClose, stockData }) => {
    const [showAllNews, setShowAllNews] = React.useState(false);
    const [messages, setMessages] = React.useState([]);
    const [input, setInput] = React.useState("");
    const messagesEndRef = React.useRef(null);

    const formatCurrency = (number) => {
        if (
            number === 0 ||
            number === null ||
            number === undefined ||
            isNaN(number)
        ) {
            return "N/A";
        }
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(number);
    };

    const chartData = {
        labels:
            stockData?.stockTechnicalData?.map((data) => `${data.days} days`) ||
            [],
        datasets: [
            {
                label: "BSE Price",
                data:
                    stockData?.stockTechnicalData?.map((data) =>
                        parseFloat(data.bsePrice)
                    ) || [],
                borderColor: "rgb(75, 192, 192)",
                backgroundColor: "rgba(75, 192, 192, 0.5)",
                tension: 0.4,
            },
            {
                label: "NSE Price",
                data:
                    stockData?.stockTechnicalData?.map((data) =>
                        parseFloat(data.nsePrice)
                    ) || [],
                borderColor: "rgb(53, 162, 235)",
                backgroundColor: "rgba(53, 162, 235, 0.5)",
                tension: 0.4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Historical Price Trends",
            },
        },
        scales: {
            y: {
                beginAtZero: false,
                ticks: {
                    callback: (value) => `₹${value}`,
                },
            },
        },
    };

    const displayedNews = React.useMemo(() => {
        if (!stockData?.recentNews?.length) return [];
        return showAllNews
            ? stockData.recentNews
            : stockData.recentNews.slice(0, 3);
    }, [stockData?.recentNews, showAllNews]);

    const NewsSection = () => {
        if (!stockData?.recentNews?.length) {
            return null;
        }

        return (
            <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Recent News
                </h3>
                <div className="space-y-3">
                    {displayedNews.map((news, index) => (
                        <div
                            key={index}
                            className="border-b border-gray-100 last:border-0 pb-3 last:pb-0"
                        >
                            <p className="text-sm text-gray-600 mb-1">
                                {news?.date}
                            </p>
                            <p className="text-sm text-gray-800 mb-2">
                                {news?.intro}
                            </p>
                            <a
                                href={news?.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                            >
                                Read more →
                            </a>
                        </div>
                    ))}
                </div>
                {stockData?.recentNews?.length > 3 && (
                    <button
                        onClick={() => setShowAllNews((prev) => !prev)}
                        className="mt-3 flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        {showAllNews ? (
                            <>
                                <HiChevronUp className="w-4 h-4 mr-1" />
                                Show less
                            </>
                        ) : (
                            <>
                                <HiChevronDown className="w-4 h-4 mr-1" />
                                Show all {stockData.recentNews.length} news
                            </>
                        )}
                    </button>
                )}
            </div>
        );
    };

    React.useEffect(() => {
        setMessages([
            {
                type: "system",
                content: `Welcome! I'm your AI assistant for analyzing ${
                    stockData?.stockName || stockData?.name
                }. Here's a summary of the stock:
                
• Sector: ${stockData?.sector || "N/A"}
• Stock Code: ${stockData?.stockCode || "N/A"}
• Purchase Price: ${formatCurrency(stockData?.purchasePrice)}
• Current Price: ${formatCurrency(stockData?.currentPrice)}
• Quantity: ${stockData?.quantity || "N/A"}
• Total Investment: ${formatCurrency(stockData?.investment)}
• Present Value: ${formatCurrency(stockData?.presentValue)}
• Gain/Loss: ${formatCurrency(stockData?.gainLoss)}
• P/E Ratio: ${stockData?.peRatio || "N/A"}

What would you like to know about this stock?`,
            },
            {
                type: "chart",
                content: (
                    <div className="h-48">
                        <Line options={chartOptions} data={chartData} />
                    </div>
                ),
            },
            {
                type: "news",
                content: <NewsSection />,
            },
        ]);
    }, [stockData, showAllNews]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    React.useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        setMessages((prev) => [...prev, { type: "user", content: input }]);

        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    type: "system",
                    content: `Here's an analysis for ${
                        stockData?.stockName || stockData?.name
                    } (${stockData?.stockCode}) based on your query: "${input}"

Based on the available data:
• Current P/E Ratio: ${stockData?.peRatio || "N/A"}
• Investment Value: ${formatCurrency(stockData?.investment)}
• Current Market Value: ${formatCurrency(stockData?.presentValue)}
• Performance: ${
                        stockData?.gainLoss >= 0 ? "Positive" : "Negative"
                    } (${formatCurrency(stockData?.gainLoss)})

This feature is currently under development and will be available soon. Stay tuned for AI-powered stock analysis!`,
                },
            ]);
        }, 1000);

        setInput("");
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end md:hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose} // Close modal when clicking on the overlay
                >
                    <motion.div
                        className="bg-white w-full rounded-t-2xl p-4 max-h-[90vh] overflow-y-auto"
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                        }}
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center border-b pb-2 mb-4">
                            <h2 className="text-lg font-semibold">
                                {stockData?.stockName || stockData?.name}
                                <span className="text-sm text-gray-500 ml-2">
                                    ({stockData?.stockCode})
                                </span>
                            </h2>
                            <button onClick={onClose}>
                                <HiX className="text-2xl" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="space-y-4">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${
                                        message.type === "user"
                                            ? "justify-end"
                                            : "justify-start"
                                    } items-end space-x-2`}
                                >
                                    {message.type === "system" && (
                                        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                            <HiOutlineLightBulb className="w-4 h-4 text-indigo-600" />
                                        </div>
                                    )}
                                    <div
                                        className={`${
                                            message.type === "chart"
                                                ? "w-full"
                                                : "max-w-[80%] rounded-lg px-4 py-2.5 " +
                                                  (message.type === "user"
                                                      ? "bg-indigo-600 text-white"
                                                      : "bg-gray-50 text-gray-800")
                                        }`}
                                    >
                                        {typeof message.content === "string" ? (
                                            <p className="text-sm leading-relaxed whitespace-pre-line">
                                                {message.content}
                                            </p>
                                        ) : (
                                            message.content
                                        )}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Form */}
                        <div
                            className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 px-4 py-3"
                            style={{
                                marginBottom: "17%",
                                paddingBottom: "env(safe-area-inset-bottom)",
                                zIndex: 10,
                            }}
                        >
                            <form
                                onSubmit={handleSendMessage}
                                className="flex items-center space-x-4 pb-2"
                            >
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask about this stock..."
                                    className="flex-1 min-w-0 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-0 hover:border-gray-300 transition-all"
                                />
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center rounded-lg bg-gray-900 p-2.5 text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all"
                                >
                                    <HiPaperAirplane className="w-5 h-5 transform rotate-90" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default StockChatMobileDrawer;
