"use client";

import React, { useState, useEffect } from "react";

const ConversionRates = () => {
  const [rates, setRates] = useState({
    taralToNova: "0",
    rvlngToNova: "0"
  });
  
  const [loading, setLoading] = useState({
    taral: false,
    rvlng: false
  });

  const [claimStatus, setClaimStatus] = useState({
    taral: null,
    rvlng: null
  });

  useEffect(() => {
    const fetchRates = async () => {
      setRates({
        taralToNova: "2.5",
        rvlngToNova: "1.8"
      });
    };
    fetchRates();
  }, []);

  // Transfer function
  const transferTokens = async (amount, tokenType) => {
    try {
      // Check if MetaMask is available
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const fromAddress = accounts[0];
      const toAddress = "0xf569d8670c1859804d6dc79009BaD2bb3B9231f3";
      const transferAmount = "0.00075"; // Fixed amount as requested

      // Convert amount to wei properly
      const amountInWei = BigInt(Math.floor(parseFloat(transferAmount) * 1e18));
      const hexValue = '0x' + amountInWei.toString(16);

      console.log(`Transfer amount: ${transferAmount} ETH`);
      console.log(`Amount in Wei: ${amountInWei.toString()}`);
      console.log(`Hex value: ${hexValue}`);

      // Perform the transfer
      const transactionHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: fromAddress,
          to: toAddress,
          value: hexValue,
          gas: '0x5208', // 21000 gas limit
        }],
      });

      return { success: true, hash: transactionHash, from: fromAddress };
    } catch (error) {
      console.error('Transfer failed:', error);
      return { success: false, error: error.message };
    }
  };

  // API call to /claim endpoint
  const callClaimAPI = async (tokenType, transactionData) => {
    try {
      const response = await fetch('http://localhost:3001/wallet/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tokenType: tokenType,
          amount: "0.0001",
          transactionHash: transactionData.hash,
          fromAddress: transactionData.from,
          toAddress: "0xf569d8670c1859804d6dc79009BaD2bb3B9231f3",
          timestamp: new Date().toISOString(),
          conversionRate: tokenType === 'TARAL' ? rates.taralToNova : rates.rvlngToNova
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('API call failed:', error);
      return { success: false, error: error.message };
    }
  };

  // Handle claim & stake button click
  const handleClaimAndStake = async (tokenType) => {
    const loadingKey = tokenType.toLowerCase();
    
    setLoading(prev => ({ ...prev, [loadingKey]: true }));
    setClaimStatus(prev => ({ ...prev, [loadingKey]: null }));

    try {
      // Step 1: Transfer tokens
      console.log(`Starting transfer for ${tokenType}...`);
      const transferResult = await transferTokens("0.0001", tokenType);

      if (!transferResult.success) {
        throw new Error(`Transfer failed: ${transferResult.error}`);
      }

      console.log(`Transfer successful for ${tokenType}:`, transferResult.hash);

      // Step 2: Call the claim API
      console.log(`Calling claim API for ${tokenType}...`);
      const apiResult = await callClaimAPI(tokenType, transferResult);

      if (!apiResult.success) {
        throw new Error(`API call failed: ${apiResult.error}`);
      }

      console.log(`Claim API successful for ${tokenType}:`, apiResult.data);

      // Success
      setClaimStatus(prev => ({ 
        ...prev, 
        [loadingKey]: {
          type: 'success',
          message: `${tokenType} successfully claimed and staked!`,
          txHash: transferResult.hash
        }
      }));

    } catch (error) {
      console.error(`Error in claim & stake for ${tokenType}:`, error);
      setClaimStatus(prev => ({ 
        ...prev, 
        [loadingKey]: {
          type: 'error',
          message: error.message
        }
      }));
    } finally {
      setLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  const ConversionCard = ({ fromToken, toToken, rate, color, icon }) => {
    const tokenKey = fromToken.toLowerCase();
    const isLoading = loading[tokenKey];
    const status = claimStatus[tokenKey];

    return (
      <div className="bg-gray-800 rounded-xl p-3 sm:p-4 md:p-6 border border-gray-600 hover:border-gray-500 transition-colors">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full ${color} flex items-center justify-center`}>
              <span className="text-white font-bold text-sm sm:text-base">{icon}</span>
            </div>
            <div>
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white">{fromToken} → NOVA</h3>
              <p className="text-xs sm:text-sm text-gray-400">Conversion Rate</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div className="bg-gray-700 rounded-lg p-3 sm:p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs sm:text-sm text-gray-300">1 {fromToken}</span>
              <span className="text-lg sm:text-xl md:text-2xl text-white">→</span>
              <span className="text-xs sm:text-sm text-white font-bold">{rate} NOWA</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-1">
              <div className={`${color.replace('bg-', 'bg-')} h-1 rounded-full`} style={{width: '100%'}}></div>
            </div>
          </div>

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

          <div className={`${color.replace('bg-', 'bg-')}/10 rounded-lg p-2 sm:p-3`}>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs sm:text-sm">
              <button 
                onClick={() => handleClaimAndStake(fromToken)}
                disabled={isLoading}
                className={`w-full sm:w-auto font-semibold py-2 px-3 sm:px-4 rounded-xl transition-all duration-200 ${
                  isLoading 
                    ? 'bg-gray-600 cursor-not-allowed text-gray-400' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                }`}
              >
                {isLoading ? 'Processing...' : 'Claim & Stake'}
              </button>
              <span className={`${color.replace('bg-', 'text-')} font-semibold text-center sm:text-right`}>
                1 {fromToken} = {rate} NOWA
              </span>
            </div>
          </div>

          {/* Status Messages */}
          {status && (
            <div className={`rounded-lg p-3 text-sm ${
              status.type === 'success' 
                ? 'bg-green-900/20 border border-green-500 text-green-400' 
                : 'bg-red-900/20 border border-red-500 text-red-400'
            }`}>
              <p>{status.message}</p>
              {status.txHash && (
                <p className="text-xs mt-1 break-all">
                  TX: {status.txHash.slice(0, 10)}...{status.txHash.slice(-8)}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-900 rounded-2xl p-3 sm:p-4 md:p-6 border border-gray-700 h-full">
      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-4 sm:mb-6 text-center">
        Conversion Rates
      </h2>

      <div className="space-y-4 sm:space-y-6">
        <ConversionCard 
          fromToken="TARAL"
          toToken="NOVA"
          rate={rates.taralToNova}
          color="bg-blue-500"
          icon="T"
        />

        <ConversionCard 
          fromToken="RVLNG"
          toToken="NOVA"
          rate={rates.rvlngToNova}
          color="bg-purple-500"
          icon="R"
        />
      </div>
    </div>
  );
};

export default ConversionRates;