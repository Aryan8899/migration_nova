"use client";

import React, { useState, useEffect } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConversionCard from '../../common-components/component/ConversionCard';
import { useTransactionHandler } from '../../common-components/hooks/useTransactionHandler';

const ConversionRates = () => {
  const [rates, setRates] = useState({
    taralToNOWA: "0",
    rvlngToNOWA: "0",
    bigbaitToNOWA: "0",
  });

  const { loading, handleClaimAndStake, canClaimToken } = useTransactionHandler(rates);

  useEffect(() => {
    const fetchRates = async () => {
      setRates({
        taralToNOWA: "2.5",
        rvlngToNOWA: "1.8",
        bigbaitToNOWA: "3.2",
      });
    };
    fetchRates();
  }, []);

  return (
    <div className="bg-gray-900 rounded-2xl p-3 sm:p-4 md:p-6 border border-gray-700 h-full">
      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-4 sm:mb-6 text-center">
        Conversion Rates
      </h2>

      <div className="space-y-4 sm:space-y-6">
        <ConversionCard
          fromToken="TARAL"
          toToken="NOWA"
          rate={rates.taralToNOWA}
          color="bg-blue-500"
          icon="T"
          isLoading={loading.taral}
          onClaimAndStake={handleClaimAndStake}
          canClaimToken={canClaimToken("TARAL")}
        />

        <ConversionCard
          fromToken="RVLNG"
          toToken="NOWA"
          rate={rates.rvlngToNOWA}
          color="bg-purple-500"
          icon="R"
          isLoading={loading.rvlng}
          onClaimAndStake={handleClaimAndStake}
          canClaimToken={canClaimToken("RVLNG")}
        />
        <ConversionCard
          fromToken="BIGBAIT" // CHANGE FROM "BIGBAT"
          toToken="NOWA"
          rate={rates.bigbaitToNOWA} // CHANGE FROM rates.bigbatToNOWA
          color="bg-orange-500"
          icon="B"
          isLoading={loading.bigbait} // CHANGE FROM loading.bigbat
          onClaimAndStake={handleClaimAndStake}
          canClaimToken={canClaimToken("BIGBAIT")} // CHANGE FROM "BIGBAT"
        />
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
};

export default ConversionRates;