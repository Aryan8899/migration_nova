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
    <div>
      <div className="container mx-auto">
        <div className="w-full flex items-center justify-center flex-col mt-20 gap-4">
          <h1 className="text-6xl">NOWA: Claim. Stake. Earn</h1>
          <p className="w-full md:w-[60%] text-center">
            Start by claiming your free NOWA tokens through our airdrop. Then
            stake them to earn daily rewards and grow your crypto portfolio—your
            journey to smarter earning starts here
          </p>
        </div>
        <div className="grid grid-cols-12 grid-rows-12  lg:h-[700px] xl:h-[600px] gap-4 mt-20">
          <AirDropClaim flipped={flipped} setFlipped={setFlipped} />
          <div className="col-span-12 lg:col-span-8 xl:col-span-3 row-span-4 bg-background p-4 md:p-8 rounded-2xl flex items-start flex-col justify-center gap-4">
            <h1>Annual Percentage Yield</h1>
            <p className="text-4xl font-semibold">{formattedDetail?.apy}%</p>
          </div>
          <Stake flipped={flipped} setFlipped={setFlipped} />
          <div className="col-span-12 md:col-span-4 xl:col-span-3 row-span-4 bg-background p-4 md:p-8 rounded-2xl flex items-start flex-col justify-center gap-4">
            <h1>Total Staked Users</h1>
            <p className="text-4xl font-semibold">
              {formatCurrency({
                value: formattedDetail?.totalUniqueAddress,
              })}
            </p>
          </div>
          <div className="col-span-12 md:col-span-4 row-span-4 bg-background p-8 rounded-2xl flex items-start flex-col justify-center gap-4">
            <h1>My Staked Amount</h1>
            <p className="text-4xl font-semibold">
              {formatCurrency({
                value: formattedDetail?.myStaked,
                symbol: "NOWA",
              })}
            </p>
          </div>
          <div className="col-span-12 md:col-span-8 row-span-4 bg-background p-8 rounded-2xl flex flex-col justify-center">
            <div className="flex justify-between items-start md:items-center flex-col gap-4 md:gap-0 md:flex-row ">
              <div className="flex flex-col gap-4">
                <h1>My Earning</h1>
                <p className="text-4xl font-semibold">
                  {formatCurrency({
                    value: formattedDetail?.totalEarning,
                    symbol: "NOWA",
                  })}
                </p>
              </div>
              {formattedDetail?.totalEarning > 0 && (
                <button
                  className="flex bg-primary w-56 rounded-2xl h-10 items-center px-4 cursor-pointer"
                  onClick={() => {
                    // if (writeContractPending) {
                    //   return;
                    // }
                    // claimHandler();
                  }}
                >
                  <p className=" grow text-black">Coming Soon</p>
                  <div className="bg-black/30 p-1 rounded-lg">
                    <IconArrowRight color="black" />
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <FAQSection />
    </div>
  );
};

export default Airdrop;
/* Rectangle 7605 */
