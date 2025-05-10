import React from "react";
import { HiOutlineLightBulb } from "react-icons/hi";

const AnalyzeButton = ({ onClick, className = "" }) => {
    return (
        <button
            className={`
                inline-flex items-center px-3 py-1.5 
                bg-gray-900 text-white text-sm font-medium 
                rounded-md hover:bg-gray-800 
                cursor-pointer
                focus:outline-none focus:ring-0
                transition-all duration-200 ease-in-out
                ${className}
            `}
            onClick={onClick}
        >
            <HiOutlineLightBulb className="w-4 h-4 mr-1.5" />
            Analyse
        </button>
    );
};

export default AnalyzeButton;
