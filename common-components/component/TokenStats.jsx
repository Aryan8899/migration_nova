import React from 'react';

const TokenStats = ({ rate }) => {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4">
      <div className="text-center">
        <p className="text-gray-400 text-xs sm:text-sm">Exchange Rate</p>
        <p className="text-white font-semibold text-sm sm:text-base">1:{rate}</p>
      </div>
      <div className="text-center">
        <p className="text-gray-400 text-xs sm:text-sm">Status</p>
        <p className="text-green-400 font-semibold text-sm sm:text-base">Active</p>
      </div>
    </div>
  );
};

export default TokenStats;