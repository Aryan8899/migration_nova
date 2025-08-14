"use client";
import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import { parseUnits, formatUnits } from "ethers";
import {
  useAccount,
  useConfig,
  useWriteContract,
  useReadContract,
} from "wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { useAppKit } from "@reown/appkit/react";
import {
  abi,
  MIGRATION_CONTRACT_ADDRESS,
  TARAL_TOKEN_ADDRESS,
  RVLNG_TOKEN_ADDRESS,
  formatCurrency,
} from "@/const";

const MigrationClaim = ({ activeTab, migrationData, onMigrationComplete }) => {
  const config = useConfig();
  const { address, isConnected } = useAccount();
  const { open } = useAppKit();
  const { writeContractAsync } = useWriteContract();

  const [migrationAmount, setMigrationAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState(false);

  // Check token allowance
  const { data: taralAllowance, refetch: taralAllowanceRefetch } = useReadContract({
    abi: abi.ERC20_ABI,
    address: TARAL_TOKEN_ADDRESS,
    args: [address, MIGRATION_CONTRACT_ADDRESS],
    functionName: "allowance",
    enabled: !!address && activeTab === "taral",
  });

  const { data: rvlngAllowance, refetch: rvlngAllowanceRefetch } = useReadContract({
    abi: abi.ERC20_ABI,
    address: RVLNG_TOKEN_ADDRESS,
    args: [address, MIGRATION_CONTRACT_ADDRESS],
    functionName: "allowance",
    enabled: !!address && activeTab === "rvlng",
  });

  const currentTokenData = useMemo(() => {
    if (activeTab === "taral") {
      return {
        name: "TARAL",
        balance: migrationData.userTaralBalance,
        migrated: migrationData.userTaralMigrated,
        exchangeRate: migrationData.taralExchangeRate,
        allowance: taralAllowance ? Number(formatUnits(taralAllowance)) : 0,
        tokenAddress: TARAL_TOKEN_ADDRESS,
        color: "blue",
      };
    } else {
      return {
        name: "RVLNG",
        balance: migrationData.userRvlngBalance,
        migrated: migrationData.userRvlngMigrated,
        exchangeRate: migrationData.rvlngExchangeRate,
        allowance: rvlngAllowance ? Number(formatUnits(rvlngAllowance)) : 0,
        tokenAddress: RVLNG_TOKEN_ADDRESS,
        color: "purple",
      };
    }
  }, [activeTab, migrationData, taralAllowance, rvlngAllowance]);

  const calculatedNowa = useMemo(() => {
    if (!migrationAmount || !currentTokenData.exchangeRate) return 0;
    return Number(migrationAmount) * currentTokenData.exchangeRate;
  }, [migrationAmount, currentTokenData.exchangeRate]);

  const needsApproval = useMemo(() => {
    if (!migrationAmount) return false;
    return Number(migrationAmount) > currentTokenData.allowance;
  }, [migrationAmount, currentTokenData.allowance]);

  const handleApprove = async () => {
    if (!isConnected) {
      open();
      return;
    }

    if (!migrationAmount) {
      toast.error("Please enter an amount to approve");
      return;
    }

    setApproving(true);
    try {
      const amountToApprove = parseUnits(migrationAmount, 18);
      
      const tx = await writeContractAsync({
        abi: abi.ERC20_ABI,
        address: currentTokenData.tokenAddress,
        functionName: "approve",
        args: [MIGRATION_CONTRACT_ADDRESS, amountToApprove],
      });

      toast.info("Approval transaction submitted...");
      
      await waitForTransactionReceipt(config, {
        hash: tx,
      });

      toast.success("Token approval successful!");
      
      // Refetch allowance
      if (activeTab === "taral") {
        await taralAllowanceRefetch();
      } else {
        await rvlngAllowanceRefetch();
      }
      
    } catch (error) {
      console.error("Approval error:", error);
      toast.error("Approval failed: " + (error.message || "Unknown error"));
    } finally {
      setApproving(false);
    }
  };

  const handleMigration = async () => {
    if (!isConnected) {
      open();
      return;
    }

    if (!migrationData.isWhitelisted) {
      toast.error("Your address is not whitelisted for migration");
      return;
    }

    if (!migrationData.migrationActive) {
      toast.error("Migration is currently inactive");
      return;
    }

    if (!migrationAmount) {
      toast.error("Please enter an amount to migrate");
      return;
    }

    if (Number(migrationAmount) > currentTokenData.balance) {
      toast.error("Insufficient balance");
      return;
    }

    if (Number(migrationAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      const amountToMigrate = parseUnits(migrationAmount, 18);
      const functionName = activeTab === "taral" ? "migrateTaral" : "migrateRvlng";
      
      const tx = await writeContractAsync({
        abi: abi.MIGRATION_ABI,
        address: MIGRATION_CONTRACT_ADDRESS,
        functionName: functionName,
        args: [amountToMigrate],
      });

      toast.info("Migration transaction submitted...");
      
      await waitForTransactionReceipt(config, {
        hash: tx,
      });

      toast.success(`Successfully migrated ${migrationAmount} ${currentTokenData.name} to ${calculatedNowa.toFixed(4)} NOWA!`);
      
      setMigrationAmount("");
      onMigrationComplete();
      
    } catch (error) {
      console.error("Migration error:", error);
      toast.error("Migration failed: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleMaxClick = () => {
    setMigrationAmount(currentTokenData.balance.toString());
  };

  if (!isConnected) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
        <h3 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h3>
        <p className="text-gray-300 mb-6">
          Please connect your wallet to check eligibility and start the migration process.
        </p>
        <button
          onClick={() => open()}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  if (!migrationData.isWhitelisted) {
    return (
      <div className="bg-red-500/10 backdrop-blur-md rounded-2xl p-8 border border-red-500/20 text-center">
        <h3 className="text-2xl font-bold text-red-400 mb-4">Not Whitelisted</h3>
        <p className="text-gray-300 mb-4">
          Your address ({address?.slice(0, 6)}...{address?.slice(-4)}) is not eligible for migration.
        </p>
        <p className="text-gray-400 text-sm">
          Please contact support if you believe this is an error.
        </p>
      </div>
    );
  }

  if (!migrationData.migrationActive) {
    return (
      <div className="bg-yellow-500/10 backdrop-blur-md rounded-2xl p-8 border border-yellow-500/20 text-center">
        <h3 className="text-2xl font-bold text-yellow-400 mb-4">Migration Inactive</h3>
        <p className="text-gray-300">
          The migration process is currently inactive. Please check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">
          Migrate {currentTokenData.name} to NOWA
        </h3>
        <p className="text-gray-300">
          Exchange Rate: 1 {currentTokenData.name} = {currentTokenData.exchangeRate} NOWA
        </p>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white/5 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Your {currentTokenData.name} Balance</p>
          <p className="text-xl font-bold text-white">
            {formatCurrency(currentTokenData.balance)}
          </p>
        </div>
        
        <div className="bg-white/5 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Already Migrated</p>
          <p className="text-xl font-bold text-white">
            {formatCurrency(currentTokenData.migrated)}
          </p>
        </div>
        
        <div className="bg-white/5 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Your NOWA Balance</p>
          <p className="text-xl font-bold text-white">
            {formatCurrency(migrationData.userNowaBalance)}
          </p>
        </div>
      </div>

      {/* Migration Form */}
      <div className="space-y-6">
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Amount to Migrate
          </label>
          <div className="relative">
            <input
              type="number"
              value={migrationAmount}
              onChange={(e) => setMigrationAmount(e.target.value)}
              placeholder="0.0"
              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 pr-20"
              disabled={loading || approving}
            />
            <button
              onClick={handleMaxClick}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-300 text-sm font-medium"
              disabled={loading || approving}
            >
              MAX
            </button>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-400">
              Balance: {formatCurrency(currentTokenData.balance)} {currentTokenData.name}
            </span>
            {migrationAmount && (
              <span className="text-green-400">
                You'll receive: {formatCurrency(calculatedNowa)} NOWA
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {needsApproval ? (
            <button
              onClick={handleApprove}
              disabled={approving || !migrationAmount || Number(migrationAmount) <= 0}
              className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-300 ${
                approving || !migrationAmount || Number(migrationAmount) <= 0
                  ? "bg-gray-600 cursor-not-allowed"
                  : `bg-gradient-to-r from-${currentTokenData.color}-500 to-${currentTokenData.color}-600 hover:from-${currentTokenData.color}-600 hover:to-${currentTokenData.color}-700 transform hover:scale-105`
              }`}
            >
              {approving ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Approving...</span>
                </div>
              ) : (
                `Approve ${currentTokenData.name}`
              )}
            </button>
          ) : (
            <button
              onClick={handleMigration}
              disabled={loading || !migrationAmount || Number(migrationAmount) <= 0 || Number(migrationAmount) > currentTokenData.balance}
              className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-300 ${
                loading || !migrationAmount || Number(migrationAmount) <= 0 || Number(migrationAmount) > currentTokenData.balance
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transform hover:scale-105"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Migrating...</span>
                </div>
              ) : (
                "Migrate to NOWA"
              )}
            </button>
          )}
        </div>

        {/* Migration Info */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <h4 className="text-blue-400 font-medium mb-2">Migration Details</h4>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• Migration is irreversible once confirmed</li>
            <li>• NOWA tokens will be sent to your connected wallet</li>
            <li>• Gas fees apply for approval and migration transactions</li>
            <li>• Make sure you have enough ETH for gas fees</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MigrationClaim;