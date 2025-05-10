import { useState, useEffect, useCallback } from 'react';

export const useStockUpdates = (initialSectorWiseStocks) => {
    const [sectorWiseStocks, setSectorWiseStocks] = useState(initialSectorWiseStocks);
    const [lastUpdateTime, setLastUpdateTime] = useState(new Date());

    const fetchLatestStockData = useCallback(async () => {
        try {
            // Replace this with your actual API call
            const response = await fetch('/api/stocks/latest');
            const newStocksData = await response.json();
            
            setSectorWiseStocks(prevData => {
                const updatedData = { ...prevData };
                
                // Update each sector's stocks
                Object.entries(prevData).forEach(([sector, stocks]) => {
                    updatedData[sector] = stocks.map(stock => {
                        const updatedStock = newStocksData.find(
                            newStock => newStock.id === stock.id || newStock.code === stock.code
                        );
                        
                        if (!updatedStock) return stock;
                        
                        return {
                            ...stock,
                            currentPrice: updatedStock.currentPrice,
                            peRatio: updatedStock.peRatio,
                            latestEarnings: updatedStock.latestEarnings,
                            presentValue: updatedStock.currentPrice * stock.quantity
                        };
                    });
                });
                
                return updatedData;
            });
            
            setLastUpdateTime(new Date());
        } catch (error) {
            console.error('Failed to fetch stock updates:', error);
        }
    }, []);

    useEffect(() => {
        // Initial fetch
        fetchLatestStockData();

        // Set up periodic updates every 45 seconds
        const intervalId = setInterval(fetchLatestStockData, 45000);

        return () => clearInterval(intervalId);
    }, [fetchLatestStockData]);

    return {
        sectorWiseStocks,
        lastUpdateTime
    };
};
