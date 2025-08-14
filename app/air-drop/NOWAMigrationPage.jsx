"use client";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { formatUnits } from "ethers";
import {
  useAccount,
  useConfig,
  useReadContract,
} from "wagmi";
import MigrationClaim from "@/common-components/migration/migration-claim";
import FAQSection from "@/common-components/FAQSection";
import {
  abi,
  MIGRATION_CONTRACT_ADDRESS,
  TARAL_TOKEN_ADDRESS,
  RVLNG_TOKEN_ADDRESS,
  NOWA_TOKEN_ADDRESS,
} from "@/const";

const NOWAMigrationPage = () => {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState("taral"); // "taral" or "rvlng"
  
  // Read contract data for TARAL migration
  const { data: taralExchangeRate, refetch: taralExchangeRateRefetch } = useReadContract({
    abi: abi.MIGRATION_ABI,
    address: MIGRATION_CONTRACT_ADDRESS,
    functionName: "taralExchangeRate",
  });

  const { data: rvlngExchangeRate, refetch: rvlngExchangeRateRefetch } = useReadContract({
    abi: abi.MIGRATION_ABI,
    address: MIGRATION_CONTRACT_ADDRESS,
    functionName: "rvlngExchangeRate",
  });

  const { data: totalTaralMigrated, refetch: totalTaralMigratedRefetch } = useReadContract({
    abi: abi.MIGRATION_ABI,
    address: MIGRATION_CONTRACT_ADDRESS,
    functionName: "totalTaralMigrated",
  });

  const { data: totalRvlngMigrated, refetch: totalRvlngMigratedRefetch } = useReadContract({
    abi: abi.MIGRATION_ABI,
    address: MIGRATION_CONTRACT_ADDRESS,
    functionName: "totalRvlngMigrated",
  });

  const { data: totalNowaMinted, refetch: totalNowaMintedRefetch } = useReadContract({
    abi: abi.MIGRATION_ABI,
    address: MIGRATION_CONTRACT_ADDRESS,
    functionName: "totalNowaMinted",
  });

  const { data: userTaralMigrated, refetch: userTaralMigratedRefetch } = useReadContract({
    abi: abi.MIGRATION_ABI,
    address: MIGRATION_CONTRACT_ADDRESS,
    args: [address],
    functionName: "userTaralMigrated",
    enabled: !!address,
  });

  const { data: userRvlngMigrated, refetch: userRvlngMigratedRefetch } = useReadContract({
    abi: abi.MIGRATION_ABI,
    address: MIGRATION_CONTRACT_ADDRESS,
    args: [address],
    functionName: "userRvlngMigrated",
    enabled: !!address,
  });

  const { data: isWhitelisted, refetch: isWhitelistedRefetch } = useReadContract({
    abi: abi.MIGRATION_ABI,
    address: MIGRATION_CONTRACT_ADDRESS,
    args: [address],
    functionName: "isWhitelisted",
    enabled: !!address,
  });

  const { data: migrationActive, refetch: migrationActiveRefetch } = useReadContract({
    abi: abi.MIGRATION_ABI,
    address: MIGRATION_CONTRACT_ADDRESS,
    functionName: "migrationActive",
  });

  // User token balances
  const { data: taralBalance, refetch: taralBalanceRefetch } = useReadContract({
    abi: abi.ERC20_ABI,
    address: TARAL_TOKEN_ADDRESS,
    args: [address],
    functionName: "balanceOf",
    enabled: !!address,
  });

  const { data: rvlngBalance, refetch: rvlngBalanceRefetch } = useReadContract({
    abi: abi.ERC20_ABI,
    address: RVLNG_TOKEN_ADDRESS,
    args: [address],
    functionName: "balanceOf",
    enabled: !!address,
  });

  const { data: nowaBalance, refetch: nowaBalanceRefetch } = useReadContract({
    abi: abi.ERC20_ABI,
    address: NOWA_TOKEN_ADDRESS,
    args: [address],
    functionName: "balanceOf",
    enabled: !!address,
  });

  const migrationData = useMemo(() => {
    const taralRate = taralExchangeRate ? Number(formatUnits(taralExchangeRate)) : 0;
    const rvlngRate = rvlngExchangeRate ? Number(formatUnits(rvlngExchangeRate)) : 0;
    const totalTaralMig = totalTaralMigrated ? Number(formatUnits(totalTaralMigrated)) : 0;
    const totalRvlngMig = totalRvlngMigrated ? Number(formatUnits(totalRvlngMigrated)) : 0;
    const totalNowaMint = totalNowaMinted ? Number(formatUnits(totalNowaMinted)) : 0;
    const userTaralMig = userTaralMigrated ? Number(formatUnits(userTaralMigrated)) : 0;
    const userRvlngMig = userRvlngMigrated ? Number(formatUnits(userRvlngMigrated)) : 0;
    const userTaralBal = taralBalance ? Number(formatUnits(taralBalance)) : 0;
    const userRvlngBal = rvlngBalance ? Number(formatUnits(rvlngBalance)) : 0;
    const userNowaBal = nowaBalance ? Number(formatUnits(nowaBalance)) : 0;

    return {
      taralExchangeRate: taralRate,
      rvlngExchangeRate: rvlngRate,
      totalTaralMigrated: totalTaralMig,
      totalRvlngMigrated: totalRvlngMig,
      totalNowaMinted: totalNowaMint,
      userTaralMigrated: userTaralMig,
      userRvlngMigrated: userRvlngMig,
      userTaralBalance: userTaralBal,
      userRvlngBalance: userRvlngBal,
      userNowaBalance: userNowaBal,
      isWhitelisted: Boolean(isWhitelisted),
      migrationActive: Boolean(migrationActive),
    };
  }, [
    taralExchangeRate,
    rvlngExchangeRate,
    totalTaralMigrated,
    totalRvlngMigrated,
    totalNowaMinted,
    userTaralMigrated,
    userRvlngMigrated,
    taralBalance,
    rvlngBalance,
    nowaBalance,
    isWhitelisted,
    migrationActive,
  ]);

  const refetchAllData = async () => {
    try {
      await Promise.all([
        taralExchangeRateRefetch(),
        rvlngExchangeRateRefetch(),
        totalTaralMigratedRefetch(),
        totalRvlngMigratedRefetch(),
        totalNowaMintedRefetch(),
        userTaralMigratedRefetch(),
        userRvlngMigratedRefetch(),
        taralBalanceRefetch(),
        rvlngBalanceRefetch(),
        nowaBalanceRefetch(),
        isWhitelistedRefetch(),
        migrationActiveRefetch(),
      ]);
    } catch (error) {
      console.error("Error refetching data:", error);
    }
  };

  useEffect(() => {
    if (isConnected) {
      refetchAllData();
    }
  }, [isConnected, address]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            NOWA Migration
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Migrate your TARAL and RVLNG tokens to NOWA with our secure migration protocol.
            Connect your wallet and check your eligibility to start the migration process.
          </p>
        </div>

        {/* Migration Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-2">Total TARAL Migrated</h3>
            <p className="text-3xl font-bold text-blue-400">
              {migrationData.totalTaralMigrated.toLocaleString()}
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-2">Total RVLNG Migrated</h3>
            <p className="text-3xl font-bold text-purple-400">
              {migrationData.totalRvlngMigrated.toLocaleString()}
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-2">Total NOWA Minted</h3>
            <p className="text-3xl font-bold text-green-400">
              {migrationData.totalNowaMinted.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-1 border border-white/20">
            <button
              onClick={() => setActiveTab("taral")}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === "taral"
                  ? "bg-blue-500 text-white shadow-lg"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              TARAL Migration
            </button>
            <button
              onClick={() => setActiveTab("rvlng")}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === "rvlng"
                  ? "bg-purple-500 text-white shadow-lg"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              RVLNG Migration
            </button>
          </div>
        </div>

        {/* Migration Component */}
        <div className="max-w-4xl mx-auto">
          <MigrationClaim
            activeTab={activeTab}
            migrationData={migrationData}
            onMigrationComplete={refetchAllData}
          />
        </div>
      </div>

      {/* FAQ Section */}
      <FAQSection />
    </div>
  );
};

export default NOWAMigrationPage;