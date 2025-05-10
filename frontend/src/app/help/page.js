"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import {
    HiChevronDown,
    HiChevronUp,
    HiMail,
    HiPhone,
    HiChat,
} from "react-icons/hi";

export default function HelpCenter() {
    const [activeFaq, setActiveFaq] = useState(null);

    const faqs = [
        {
            question: "How do I start investing in stocks?",
            answer: "To start investing in stocks, you need to first create an account with us. Once your account is verified, you can add funds to your account and start purchasing stocks through our platform. We recommend starting with a diversified portfolio and consulting with our investment advisors if you're new to stock market investing.",
        },
        {
            question: "What are the minimum investment requirements?",
            answer: "There is no minimum investment requirement to start trading with us. However, we recommend starting with at least ₹5,000 to build a diversified portfolio. The amount you invest should align with your financial goals and risk tolerance.",
        },
        {
            question: "How do I track my investments?",
            answer: "You can track your investments through our dashboard, which provides real-time updates on your portfolio performance. The dashboard shows your current holdings, profit/loss, and market trends. You can also set up alerts for price movements and receive regular portfolio reports.",
        },
        {
            question: "What fees do you charge for trading?",
            answer: "We charge a nominal brokerage fee of 0.05% per trade. There are no hidden charges or maintenance fees. All our fees are transparent and displayed before you confirm any transaction.",
        },
        {
            question: "How do I withdraw my funds?",
            answer: "You can withdraw your funds at any time through our platform. Simply go to the 'Withdraw' section, enter the amount you wish to withdraw, and select your preferred bank account. Withdrawals are typically processed within 24-48 hours.",
        },
        {
            question: "Is my investment safe with your platform?",
            answer: "Yes, your investments are completely safe. We are a SEBI-registered broker and follow all regulatory guidelines. Your funds are held in separate bank accounts, and we use bank-grade security measures to protect your data and transactions.",
        },
    ];

    const toggleFaq = (index) => {
        setActiveFaq(activeFaq === index ? null : index);
    };

    return (
        <div className="p-8">
            <PageHeader title="Help Center" />

            <div className="max-w-4xl mx-auto">
                {/* Support Contact Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 rounded-full">
                                <HiMail className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Email Support
                                </h3>
                                <p className="text-sm text-gray-500">
                                    support@8sapience.com
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-50 rounded-full">
                                <HiPhone className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Phone Support
                                </h3>
                                <p className="text-sm text-gray-500">
                                    +91 98765 43210
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-50 rounded-full">
                                <HiChat className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Live Chat
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Available 24/7
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQs Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="border-b border-gray-100 last:border-0"
                            >
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="w-full flex justify-between items-center py-4 text-left"
                                >
                                    <span className="text-lg font-medium text-gray-900">
                                        {faq.question}
                                    </span>
                                    {activeFaq === index ? (
                                        <HiChevronUp className="w-5 h-5 text-gray-500" />
                                    ) : (
                                        <HiChevronDown className="w-5 h-5 text-gray-500" />
                                    )}
                                </button>
                                {activeFaq === index && (
                                    <div className="pb-4">
                                        <p className="text-gray-600">
                                            {faq.answer}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Additional Resources */}
                <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Additional Resources
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-medium text-gray-900 mb-2">
                                Investment Guides
                            </h3>
                            <p className="text-sm text-gray-600">
                                Learn about different investment strategies and
                                market analysis.
                            </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-medium text-gray-900 mb-2">
                                Market Updates
                            </h3>
                            <p className="text-sm text-gray-600">
                                Stay informed with the latest market trends and
                                news.
                            </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-medium text-gray-900 mb-2">
                                Tutorial Videos
                            </h3>
                            <p className="text-sm text-gray-600">
                                Watch step-by-step guides on using our platform.
                            </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-medium text-gray-900 mb-2">
                                Investment Calculator
                            </h3>
                            <p className="text-sm text-gray-600">
                                Calculate potential returns and plan your
                                investments.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
