"use client";

import React, { useEffect, useState } from "react";
import { useTransactionHandler } from "../../common-components/hooks/useTransactionHandler"; // adjust import path

const TokenHoldings = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasInitialData, setHasInitialData] = useState(false);

  // useTransactionHandler already manages allocations & user state
  const {
    allocationLoading,
    userAllocations,
    getRemainingAmount,
    getTokenAmount,
    refreshAllocations, // This is the function you need!
  } = useTransactionHandler({
    taralToNOWA: 1, // pass rates here or fetch separately
    rvlngToNOWA: 1,
  });

  // Track when we have initial data
  useEffect(() => {
    if (userAllocations && !hasInitialData) {
      setHasInitialData(true);
    }
  }, [userAllocations, hasInitialData]);

  // Handle periodic refresh without disturbing UI
  const handlePeriodicRefresh = async () => {
    if (!hasInitialData) return; // Don't refresh if we haven't loaded initial data
    
    setIsRefreshing(true);
    try {
      await refreshAllocations();
    } finally {
      setIsRefreshing(false);
    }
  };


  const formatCurrency = (value, symbol) => {
    // Format with commas & decimals
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

  return (
    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700 h-full sm:p-4 md:p-6">
      <h2 className="text-2xl font-semibold text-white mb-6 text-center">
        Current Token Holdings
      </h2>

      <div className="space-y-8">
        {/* TARAL Holdings */}
        <div className="bg-gray-800 rounded-xl p-18 border border-gray-600 hover:border-gray-500 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white ">TARAL</h3>
                <p className="text-sm text-gray-400">Taral Token</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-4 mb-4">
            <div className="text-center">
              <p className="font-bold text-white mb-2 sm:text-xl md:text-3xl lg:text-3xl">
                {formatCurrency(getRemainingAmount("taral"), "TARAL")}
              </p>
              <p className="text-sm text-gray-300">Available Balance</p>
            </div>
          </div>
        </div>

        {/* RVLNG Holdings */}
        <div className="bg-gray-800 rounded-xl p-18 border border-gray-600 hover:border-gray-500 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-purple-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">RVLNG</h3>
                <p className="text-sm text-gray-400">Reveling Token</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-5 mb-4">
            <div className="text-center">
              <p className="sm:text-xl md:text-3xl lg:text-3xl font-bold text-white mb-2">
                {formatCurrency(getRemainingAmount("rvlng"), "RVLNG")}
              </p>
              <p className="text-sm text-gray-300">Available Balance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenHoldings;