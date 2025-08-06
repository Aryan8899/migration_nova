"use client";

import {
  abi,
  AIRDROP_CONTRACT,
  AIRDROP_CONTRACT_ADDRESS,
  formatCurrency,
  NOWA_TOKEN,
  STAKING_CONTRACT_ADDRESS,
} from "@/const";
import moment from "moment/moment";
import React, { useMemo } from "react";
import { formatUnits, parseUnits } from "ethers";
import {
  useAccount,
  useBalance,
  useConfig,
  useWriteContract,
  useReadContract,
} from "wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { toast } from "sonner";
import { useTimer } from "@/hooks/useTimer";
import { useAppKit } from "@reown/appkit/react";
import {
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";

const AirDropClaim = () => {
  const { writeContractAsync, isPending: writeContractPending } =
    useWriteContract();
  const config = useConfig();
  const { address, isConnected } = useAccount();
  const { open } = useAppKit();
  const { data: airdropInfoData, refetch: refetchAirDropInfo } =
    useReadContract({
      abi: abi.AIRDROP_ABI,
      account: address,
      address: AIRDROP_CONTRACT_ADDRESS,
      args: [address],
      functionName: "airdropInfo",
    });
  const { data: claimAmountData, refetch: claimAmountDataRefetch } =
    useReadContract({
      abi: abi.AIRDROP_ABI,
      account: address,
      address: AIRDROP_CONTRACT_ADDRESS,
      functionName: "claimAmount",
    });
  const { data: claimCooldownData, refetch: claimCooldownDataRefetch } =
    useReadContract({
      abi: abi.AIRDROP_ABI,
      account: address,
      address: AIRDROP_CONTRACT_ADDRESS,
      functionName: "claimCooldown",
    });

  const airdropInfo = useMemo(() => {
    const lastClaimTimeStamp = moment
      .unix(Number(airdropInfoData?.[2]))
      .add(Number(claimCooldownData), "seconds")
      ?.toDate();

    return {
      claimedBalance: airdropInfoData?.[0]
        ? formatUnits(airdropInfoData?.[0])
        : 0,
      noOfTimedClaimed: airdropInfoData?.[1]
        ? formatUnits(airdropInfoData?.[1])
        : 0,
      lastTimeClaimed: airdropInfoData?.[2]
        ? formatUnits(airdropInfoData?.[2])
        : 0,
      singleClaimableAmount: claimAmountData ? formatUnits(claimAmountData) : 0,
      isClaimable: moment()?.isSameOrAfter(moment(lastClaimTimeStamp)),
      claimRemainTime: lastClaimTimeStamp,
    };
  }, [airdropInfoData, claimAmountData, claimCooldownData]);

  const refetchHanlder = async () => {
    await refetchAirDropInfo();
    await claimAmountDataRefetch();
    await claimCooldownDataRefetch();
  };

  return (
    <div className="col-span-12 row-span-12 md:col-span-4 sm:row-span-6  xl:col-span-3 lg:row-span-8 bg-background rounded-2xl p-6 flex justify-between items-center flex-col">
      <h1 className="font-semibold">Airdrop Phase 1</h1>

      <div className="relative w-40 flex justify-center items-center   h-48">
        <CircularProgressbarWithChildren
          value={66}
          className="fill-primary"
          strokeWidth={10}
          styles={buildStyles({
            pathColor: "rgb(0, 255, 169)",
            trailColor: "rgb(11, 14, 19)",
          })}
        >
          <img
            src="/assets/brand/onlyLogo.png"
            alt=""
            className="object-contain h-16"
          />
        </CircularProgressbarWithChildren>
      </div>
      <div className="w-full flex flex-col gap-4 ">
        <div className="flex flex-row justify-between w-full">
          <div className="flex flex-row gap-2">
            <div className="h-5 w-5 rounded-full bg-primary" />
            <p>Total Claimed</p>
          </div>
          <p>1,000</p>
        </div>
        <div className="flex flex-row justify-between w-full">
          <div className="flex flex-row gap-2">
            <div className="h-5 w-5 rounded-full bg-card" />
            <p>Left to Claim</p>
          </div>
          <p>1,000</p>
        </div>
      </div>
    </div>
  );
};

export default AirDropClaim;
