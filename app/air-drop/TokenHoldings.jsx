"use client";

import React, { useState, useEffect } from "react";


// Updated TokenHoldings Component
const TokenHoldings = () => {
  const [holdings, setHoldings] = useState({
    taral: "0",
    rvlng: "0"
  });

  useEffect(() => {
    const fetchHoldings = async () => {
      setHoldings({
        taral: "1,250.00",
        rvlng: "850.50"
      });
    };
    fetchHoldings();
  }, []);

  const formatCurrency = (value, symbol) => {
    return `${value} ${symbol}`;
  };

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
              <p className=" font-bold text-white mb-2 sm:text-xl md:text-3xl lg:text-3xl">
                {formatCurrency(holdings.taral, "TARAL")}
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
                {formatCurrency(holdings.rvlng, "RVLNG")}
              </p>
              <p className="text-sm text-gray-300">Available Balance</p>
            </div>
          </div>

          
        </div>
      </div>

      {/* Holdings Summary */}
      
    </div>
  );
};


export default TokenHoldings;