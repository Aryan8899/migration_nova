"use client";
import AirDropClaim from "@/common-components/drop/air-drop-claim";
import Stake from "@/common-components/drop/stake";
import { abi, formatCurrency, STAKING_CONTRACT_ADDRESS } from "@/const";
import { IconArrowRight } from "@tabler/icons-react";
import { waitForTransactionReceipt } from "@wagmi/core";
import React, { useMemo } from "react";
import { toast } from "sonner";
import { formatUnits } from "viem";
import {
  useAccount,
  useConfig,
  useReadContract,
  useWriteContract,
} from "wagmi";

const Airdrop = () => {
  const { address } = useAccount();
  const config = useConfig();
  const { writeContractAsync, isPending: writeContractPending } =
    useWriteContract();
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

  const formattedDetail = useMemo(() => {
    const apy = Number(apyData) / 100;
    const claimedAmount = totalStakeAmountData
      ? formatUnits(totalStakeAmountData)
      : 0;
    const totalEarning = pendingRewardData ? formatUnits(pendingRewardData) : 0;
    return {
      apy: apy,
      totalClaimedAmount: claimedAmount,
      totalEarning: totalEarning,
    };
  }, [apyData, totalStakeAmountData, pendingRewardData]);

  const refetchHanlder = async () => {
    try {
      await apyDataRefetch();
      await totalStakeAmountDataRefetch();
      await pendingRewardDataRefetch();
    } catch (error) {
      console.log(error);
    }
  };

  const claimHandler = async () => {
    try {
      const tx = await writeContractAsync({
        abi: abi.STAKING_ABI,
        address: STAKING_CONTRACT_ADDRESS,
        account: address,
        functionName: "claimReward",
      });

      const transactionReceipt = await waitForTransactionReceipt(config, {
        hash: tx,
      });
      console.log(transactionReceipt, "asdasdasd");
      toast.success("Claimed successfully");
      refetchHanlder();
    } catch (error) {
      toast.error(error?.shortMessage || "Something went wrong");
      console.log(error);
      refetchHanlder();
    }
  };

  return (
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
        <AirDropClaim />
        <div className="col-span-12 lg:col-span-8 xl:col-span-3 row-span-4 bg-background p-4 rounded-2xl flex items-start flex-col justify-center gap-4">
          <h1>Annual Percentage Yield</h1>
          <p className="text-4xl font-semibold">{formattedDetail?.apy}%</p>
        </div>
        <Stake />
        <div className="col-span-12 md:col-span-4 xl:col-span-3 row-span-4 bg-background p-8 md:p-4 rounded-2xl flex items-start flex-col justify-center gap-4">
          <h1>Total Staked Users</h1>
          <p className="text-4xl font-semibold">5,750</p>
        </div>
        <div className="col-span-12 md:col-span-4 row-span-4 bg-background p-8 rounded-2xl flex items-start flex-col justify-center gap-4">
          <h1>Total Staked</h1>
          <p className="text-4xl font-semibold">
            {formatCurrency({
              value: formattedDetail?.totalClaimedAmount,
              symbol: "NOWA",
            })}
          </p>
        </div>
        <div className="col-span-12 md:col-span-8 row-span-4 bg-background p-8 rounded-2xl flex flex-col justify-center">
          <div className="flex justify-between items-start md:items-center flex-col gap-4 md:gap-0 md:flex-row ">
            <div className="flex flex-col gap-4">
              <h1>Total Earning</h1>
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
                  if (writeContractPending) {
                    return;
                  }
                  claimHandler();
                }}
              >
                <p className=" grow text-black">
                  {writeContractPending ? `Claiming...` : `Claim`}
                </p>
                <div className="bg-black/30 p-1 rounded-lg">
                  <IconArrowRight color="black" />
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Airdrop;
/* Rectangle 7605 */
