import { memo, useMemo } from 'react';
import { useStockUpdates } from '../hooks/useStockUpdates';
import StockDynamicData from './StockDynamicData';

const StockCard = memo(({ stock }) => {
    // Calculate any derived values that depend on the dynamic data
    const derivedValues = useMemo(() => {
        return {
            marketCap: stock.cmp * stock.sharesOutstanding,
            valueScore: calculateValueScore(stock.peRatio, stock.latestEarnings)
            // Add other derived calculations here
        };
    }, [stock.cmp, stock.peRatio, stock.latestEarnings, stock.sharesOutstanding]);

    return (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="font-medium text-lg">{stock.name}</h3>
                    <p className="text-gray-600 text-sm">{stock.sector}</p>
                </div>
                <div className="text-right">
                    <div className="text-sm text-gray-600">Value Score</div>
                    <div className="font-medium">{derivedValues.valueScore}</div>
                </div>
            </div>

            <div className="space-y-3">
                <StockDynamicData
                    cmp={stock.cmp}
                    peRatio={stock.peRatio}
                    latestEarnings={stock.latestEarnings}
                />
                
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Market Cap</span>
                    <span className="font-medium">{derivedValues.marketCap}</span>
                </div>
            </div>
        </div>
    );
});

const StockTableMobile = ({ initialStockData }) => {
    const { stockData, lastUpdateTime } = useStockUpdates(initialStockData);

    return (
        <div>
            <div className="text-sm text-gray-500 mb-4">
                Last updated: {lastUpdateTime.toLocaleTimeString()}
            </div>
            <div className="space-y-4">
                {stockData.map(stock => (
                    <StockCard key={stock.id} stock={stock} />
                ))}
            </div>
        </div>
    );
};

// Helper function for derived calculations
const calculateValueScore = (peRatio, latestEarnings) => {
    // Implement your value score calculation logic here
    return (latestEarnings / peRatio * 100).toFixed(2);
};

export default memo(StockTableMobile);
