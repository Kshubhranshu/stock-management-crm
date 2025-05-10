import { memo, useMemo } from 'react';
import { useStockUpdates } from '../hooks/useStockUpdates';
import StockDynamicData from './StockDynamicData';

const StockRow = memo(({ stock }) => {
    // Calculate any derived values that depend on the dynamic data
    const derivedValues = useMemo(() => {
        return {
            marketCap: stock.cmp * stock.sharesOutstanding,
            valueScore: calculateValueScore(stock.peRatio, stock.latestEarnings)
            // Add other derived calculations here
        };
    }, [stock.cmp, stock.peRatio, stock.latestEarnings, stock.sharesOutstanding]);

    return (
        <tr>
            <td className="p-4">{stock.name}</td>
            <td className="p-4">{stock.sector}</td>
            <td className="p-4">
                <StockDynamicData
                    cmp={stock.cmp}
                    peRatio={stock.peRatio}
                    latestEarnings={stock.latestEarnings}
                />
            </td>
            <td className="p-4">{derivedValues.marketCap}</td>
            <td className="p-4">{derivedValues.valueScore}</td>
            {/* Add other static data columns here */}
        </tr>
    );
});

const StockTable = ({ initialStockData }) => {
    const { stockData, lastUpdateTime } = useStockUpdates(initialStockData);

    return (
        <div>
            <div className="text-sm text-gray-500 mb-2">
                Last updated: {lastUpdateTime.toLocaleTimeString()}
            </div>
            <table className="w-full">
                <thead>
                    <tr>
                        <th className="p-4 text-left">Name</th>
                        <th className="p-4 text-left">Sector</th>
                        <th className="p-4 text-left">Dynamic Data</th>
                        <th className="p-4 text-left">Market Cap</th>
                        <th className="p-4 text-left">Value Score</th>
                    </tr>
                </thead>
                <tbody>
                    {stockData.map(stock => (
                        <StockRow key={stock.id} stock={stock} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Helper function for derived calculations
const calculateValueScore = (peRatio, latestEarnings) => {
    // Implement your value score calculation logic here
    return (latestEarnings / peRatio * 100).toFixed(2);
};

export default memo(StockTable);
