import React from 'react';
import { useTransactionHandler } from "../../common-components/hooks/useTransactionHandler"; // adjust path


const ConversionRate = ({ rate, fromToken, toToken }) => {
  const { allocationLoading, getRemainingAmount } = useTransactionHandler({
    taralToNOWA: 2.5, // use your actual rates
    rvlngToNOWA: 1.8,
    bigbatToNOWA: 3.2
  });

  const formatCurrency = (value, symbol) => {
    return `${parseFloat(value).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} ${symbol}`;
  };

  if (allocationLoading) {
    return (
      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700 h-full flex justify-center items-center">
        <p className="text-white">Loading holdings...</p>
      </div>
    );
  }

  const balance = getRemainingAmount(fromToken); 
  const converted = (parseFloat(balance) || 0) * rate;

  return (
    <div className="bg-gray-700 rounded-lg p-3 sm:p-4">
      <div className="flex justify-between items-center mb-2">
        {/* User balance */}
        <span className="text-xs sm:text-sm text-gray-300">
          {formatCurrency(balance, fromToken)}
        </span>

        <span className="text-lg sm:text-xl md:text-2xl text-white">→</span>

        {/* Converted value */}
        <span className="text-xs sm:text-sm text-white font-bold">
          {formatCurrency(converted, toToken)}
        </span>
      </div>
      <div className="w-full bg-gray-600 rounded-full h-1">
        <div className="bg-blue-500 h-1 rounded-full" style={{ width: '100%' }}></div>
      </div>
    </div>
  );
};

export default ConversionRate;
