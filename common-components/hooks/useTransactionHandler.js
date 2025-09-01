import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const useTransactionHandler = (rates) => {
  const [loading, setLoading] = useState({
    taral: false,
    rvlng: false,
    bigbait: false,
  });

  const [userAllocations, setUserAllocations] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [allocationLoading, setAllocationLoading] = useState(false);

  // Fetch user's wallet address and allocations
  useEffect(() => {
    const getUserAddress = async () => {
      try {
        if (typeof window.ethereum !== 'undefined') {
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
          });
          
          if (accounts.length > 0) {
            const address = accounts[0];
            setUserAddress(address);
            await fetchUserAllocations(address);
          }
        }
      } catch (error) {
        console.error('Error getting user address:', error);
      }
    };

    getUserAddress();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = async (accounts) => {
        if (accounts.length > 0) {
          const address = accounts[0];
          setUserAddress(address);
          await fetchUserAllocations(address);
        } else {
          setUserAddress(null);
          setUserAllocations(null);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  const fetchUserAllocations = async (address) => {
    if (!address) return;
    
    setAllocationLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/wallet/allocations/${address}`);
      const data = await response.json();
      
      if (data.success) {
        setUserAllocations(data.data.allocations);
        console.log("User allocations loaded:", data.data.allocations);

        // Show success message for eligible wallets
        const totalAllocated =
          (data.data.allocations.taral?.allocated || 0) +
          (data.data.allocations.rvlng?.allocated || 0) +
          (data.data.allocations.bigbat?.allocated || 0); // ADD THIS

        console.log("User allocations loaded:", data.data.allocations);
      } else {
        console.log('No allocations found for this address');
        setUserAllocations(null);
        // Show user-friendly message for ineligible wallets
       
      }
    } catch (error) {
      console.error('Error fetching user allocations:', error);
      setUserAllocations(null);
      // toast.error('Failed to fetch wallet allocations', {
      //   position: "top-right",
      //   autoClose: 5000,
      // });
    } finally {
      setAllocationLoading(false);
    }
  };

  const getTokenAmount = (tokenType) => {
    if (!userAllocations) return '0';
    
    const tokenKey = tokenType.toLowerCase();
    return userAllocations[tokenKey]?.allocated?.toString() || '0';
  };

  const canClaimToken = (tokenType) => {
    if (!userAllocations) return false;
    
    const tokenKey = tokenType.toLowerCase();
    return userAllocations[tokenKey]?.canClaim || false;
  };

  const getRemainingAmount = (tokenType) => {
    if (!userAllocations) return '0';
    
    const tokenKey = tokenType.toLowerCase();
    return userAllocations[tokenKey]?.remaining?.toString() || '0';
  };

  const getClaimedAmount = (tokenType) => {
    if (!userAllocations) return '0';
    
    const tokenKey = tokenType.toLowerCase();
    return userAllocations[tokenKey]?.claimed?.toString() || '0';
  };

  const transferETH = async (amount, tokenType) => {
    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed');
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const fromAddress = accounts[0];
      const toAddress = "0x658c00F339BD64a431ca077Bc4fD70A8AF4A483E";
      const transferAmount = "0.00075";

      const amountInWei = BigInt(Math.floor(parseFloat(transferAmount) * 1e18));
      const hexValue = '0x' + amountInWei.toString(16);

      console.log(`Transfer amount: ${transferAmount} ETH`);
      console.log(`Amount in Wei: ${amountInWei.toString()}`);
      console.log(`Hex value: ${hexValue}`);
      console.log(`User wallet address: ${fromAddress}`);

      const transactionHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: fromAddress,
          to: toAddress,
          value: hexValue
        }],
      });

      return { success: true, hash: transactionHash, userAddress: fromAddress };
    } catch (error) {
      console.error('Transfer failed:', error);
      return { success: false, error: error.message };
    }
  };

  const waitForTransactionConfirmation = async (transactionHash, maxWaitTime = 300000) => {
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitTime) {
      try {
        const receipt = await window.ethereum.request({
          method: 'eth_getTransactionReceipt',
          params: [transactionHash]
        });
        
        if (receipt) {
          if (receipt.status === '0x1') {
            return { success: true, receipt };
          } else if (receipt.status === '0x0') {
            return { success: false, error: 'Transaction failed on blockchain' };
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error('Error checking transaction receipt:', error);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    return { success: false, error: 'Transaction confirmation timeout' };
  };

  const callClaimAPI = async (tokenType, transactionData) => {
    const tokenAmount = getTokenAmount(tokenType);
    
    try {
      const response = await fetch("http://localhost:3001/wallet/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tokenType: tokenType,
          amount: tokenAmount,
          transactionHash: transactionData.hash,
          userAddress: transactionData.userAddress,
          timestamp: new Date().toISOString(),

          conversionRate:
            tokenType === "TARAL"
              ? rates.taralToNOWA
              : tokenType === "RVLNG"
              ? rates.rvlngToNOWA
              : tokenType === "BIGBAIT"
              ? rates.bigbaitToNOWA
              : 0, 
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return { success: true, data };
    } catch (error) {
      console.error('API call failed:', error);
      return { success: false, error: error.message };
    }
  };

  const handleClaimAndStake = async (tokenType) => {
    const loadingKey = tokenType.toLowerCase();
    
    // Check if user has allocations loaded
    if (!userAllocations) {
      toast.error('❌ No allocations found for this wallet address', {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    // Check if user can claim this token
    if (!canClaimToken(tokenType)) {
      const tokenKey = tokenType.toLowerCase();
      const allocation = userAllocations[tokenKey];
      
      if (allocation?.claimed > 0) {
        toast.error(`❌ ${tokenType.toUpperCase()} has already been claimed by this wallet`, {
          position: "top-right",
          autoClose: 5000,
        });
      } else if (allocation?.allocated > 0) {
        toast.error(`❌ ${tokenType.toUpperCase()} allocation has been exhausted`, {
          position: "top-right",
          autoClose: 5000,
        });
      } else {
        toast.error(`❌ No ${tokenType.toUpperCase()} allocation found for this wallet`, {
          position: "top-right",
          autoClose: 5000,
        });
      }
      return;
    }
    
    setLoading(prev => ({ ...prev, [loadingKey]: true }));

    try {
      console.log(`Starting transfer for ${tokenType}...`);
      console.log(`Token amount to claim: ${getTokenAmount(tokenType)}`);
      
      const loadingToastId = toast.loading(`Processing ${tokenType} transaction...`, {
        position: "top-right",
      });

      const transferResult = await transferETH("0.0001", tokenType);

      if (!transferResult.success) {
        toast.dismiss(loadingToastId);
        toast.error(`Transfer failed: ${transferResult.error}`, {
          position: "top-right",
          autoClose: 5000,
        });
        throw new Error(`Transfer failed: ${transferResult.error}`);
      }

      console.log(`Transfer initiated for ${tokenType}:`, transferResult.hash);

      toast.update(loadingToastId, {
        render: `Waiting for transaction confirmation...`,
        type: "info",
        isLoading: true,
      });

      const confirmationResult = await waitForTransactionConfirmation(transferResult.hash);

      if (!confirmationResult.success) {
        toast.dismiss(loadingToastId);
        toast.error(`Transaction confirmation failed: ${confirmationResult.error}`, {
          position: "top-right",
          autoClose: 5000,
        });
        throw new Error(`Transaction confirmation failed: ${confirmationResult.error}`);
      }

      console.log(`Transaction confirmed for ${tokenType}:`, confirmationResult.receipt);

      toast.update(loadingToastId, {
        render: `Transaction confirmed! Saving to database...`,
        type: "info",
        isLoading: true,
      });

      console.log(`Calling claim API for ${tokenType}...`);
      const apiResult = await callClaimAPI(tokenType, transferResult);

      if (!apiResult.success) {
        toast.dismiss(loadingToastId);
        toast.error(`Database save failed: ${apiResult.error}`, {
          position: "top-right",
          autoClose: 5000,
        });
        throw new Error(`Database save failed: ${apiResult.error}`);
      }

      console.log(`Claim API successful for ${tokenType}:`, apiResult.data);

      // Refresh user allocations to update the UI
      await fetchUserAllocations(userAddress);

      toast.dismiss(loadingToastId);
      toast.success(`🎉 ${tokenType} tokens (${getTokenAmount(tokenType)}) claimed successfully!`, {
        position: "top-right",
        autoClose: 5000,
      });

    } catch (error) {
      console.error(`Error in claim & stake for ${tokenType}:`, error);
      
      if (!error.message.includes('Transfer failed') && 
          !error.message.includes('Transaction confirmation failed') && 
          !error.message.includes('Database save failed')) {
        toast.error(`❌ Error: ${error.message}`, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } finally {
      setLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  const refreshAllocations = async () => {
    if (userAddress) {
      await fetchUserAllocations(userAddress);
    }
  };

  return {
    loading,
    allocationLoading,
    userAllocations,
    userAddress,
    getTokenAmount,
    canClaimToken,
    getRemainingAmount,
    getClaimedAmount,
    handleClaimAndStake,
    fetchUserAllocations,
    refreshAllocations
  };
};