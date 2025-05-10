import { memo } from 'react';

const StockDynamicData = memo(({ cmp, peRatio, latestEarnings }) => {
    return (
        <div className="flex gap-4">
            <div>
                <span className="text-gray-600 text-sm">CMP:</span>
                <span className="ml-2 font-medium">{cmp}</span>
            </div>
            <div>
                <span className="text-gray-600 text-sm">P/E:</span>
                <span className="ml-2 font-medium">{peRatio}</span>
            </div>
            <div>
                <span className="text-gray-600 text-sm">Earnings:</span>
                <span className="ml-2 font-medium">{latestEarnings}</span>
            </div>
        </div>
    );
}, (prevProps, nextProps) => {
    // Custom comparison function to prevent unnecessary re-renders
    return prevProps.cmp === nextProps.cmp &&
           prevProps.peRatio === nextProps.peRatio &&
           prevProps.latestEarnings === nextProps.latestEarnings;
});

StockDynamicData.displayName = 'StockDynamicData';

export default StockDynamicData;
