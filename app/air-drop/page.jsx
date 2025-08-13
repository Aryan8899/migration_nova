"use client";
import AirDropClaim from "@/common-components/drop/air-drop-claim";
import Stake from "@/common-components/drop/stake";
import {
  abi,
  AIRDROP_CONTRACT_ADDRESS,
  formatCurrency,
  STAKING_CONTRACT_ADDRESS,
} from "@/const";
import { IconArrowRight } from "@tabler/icons-react";
import { waitForTransactionReceipt } from "@wagmi/core";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { formatUnits } from "ethers";
import {
  useAccount,
  useConfig,
  useReadContract,
  useWriteContract,
} from "wagmi";
import FAQSection from "@/common-components/FAQSection";

const Airdrop = () => {
  const { address, isConnected } = useAccount();
  const [flipped, setFlipped] = useState(false);
  const { data: apyData, refetch: apyDataRefetch } = useReadContract({
    abi: abi.STAKING_ABI,
    account: address,
    address: STAKING_CONTRACT_ADDRESS,
    functionName: "apy",
  });
  const { data: totalStakeAmountData, refetch: totalStakeAmountDataRefetch } =
    useReadContract({
      abi: abi.STAKING_ABI,
      account: address,
      address: STAKING_CONTRACT_ADDRESS,
      functionName: "totalStakeAmount",
    });
  const { data: pendingRewardData, refetch: pendingRewardDataRefetch } =
    useReadContract({
      abi: abi.STAKING_ABI,
      account: address,
      address: STAKING_CONTRACT_ADDRESS,
      args: [address],
      functionName: "pendingReward",
    });

  const {
    data: totalUniqueAddressData,
    refetch: totalUniqueAddressDataRefetch,
  } = useReadContract({
    abi: abi.STAKING_ABI,
    account: address,
    address: STAKING_CONTRACT_ADDRESS,
    functionName: "totalUniqueAddress",
  });
  const { data: userInfo, refetch: userInfoRefetch } = useReadContract({
    abi: abi.STAKING_ABI,
    account: address,
    address: STAKING_CONTRACT_ADDRESS,
    args: [address],
    functionName: "userInfo",
  });

  const formattedDetail = useMemo(() => {
    const apy = Number(apyData) / 100;
    const claimedAmount = totalStakeAmountData
      ? formatUnits(totalStakeAmountData)
      : 0;
    const totalEarning = pendingRewardData ? formatUnits(pendingRewardData) : 0;
    const myStaked = userInfo?.[0] ? formatUnits(userInfo?.[0]) : 0;
    return {
      apy: apy,
      totalClaimedAmount: isConnected ? claimedAmount : 0,
      totalEarning: isConnected ? totalEarning : 0,
      totalUniqueAddress: totalUniqueAddressData
        ? Number(totalUniqueAddressData)
        : 0,
      myStaked: myStaked,
    };
  }, [
    apyData,
    totalStakeAmountData,
    pendingRewardData,
    totalUniqueAddressData,
    isConnected,
    userInfo,
  ]);

  const refetchHanlder = async () => {
    try {
      await apyDataRefetch();
      await totalStakeAmountDataRefetch();
      await pendingRewardDataRefetch();
      await totalUniqueAddressDataRefetch();
      await userInfoRefetch();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    refetchHanlder();
  }, [flipped]);

  return (
 <> 
  
        
          <AirDropClaim flipped={flipped} setFlipped={setFlipped} />
          
      <FAQSection />
 </>
  );
};

export default Airdrop;
/* Rectangle 7605 */
