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

  const { seconds, minutes, hours, isRunning, restart } = useTimer(
    airdropInfo?.claimRemainTime,
    () => {
      console.log("Timer expired");
      refetchHanlder();
    }
  );

  const claimHandler = async () => {
    try {
      const tx = await writeContractAsync({
        abi: abi.AIRDROP_ABI,
        address: AIRDROP_CONTRACT_ADDRESS,
        account: address,
        functionName: "claim",
      });

      const transactionReceipt = await waitForTransactionReceipt(config, {
        hash: tx,
      });
      toast.success("Claimed successfully");
      refetchHanlder();
    } catch (error) {
      toast.error(error?.shortMessage || "Something went wrong");
      console.log(error);
      refetchHanlder();
    }
  };

  return (
    <div className="col-span-12 row-span-12 md:col-span-4 sm:row-span-6  xl:col-span-3 lg:row-span-8 bg-background rounded-2xl p-4 flex justify-start items-center flex-col">
      <h1 className="font-semibold">Get Airdrop</h1>

      <div className="relative w-40 flex justify-center items-center   h-48">
        <div className=" relative z-20 flex items-center justify-center flex-col">
          <p className="text-white">
            {formatCurrency({
              value: airdropInfo?.claimedBalance,
              symbol: "NOWA",
            })}
          </p>
          <p className="text-second-text">Total Claimed</p>
        </div>
        <img src="/assets/drop/blur-bg.png" alt="" className="absolute z-10" />
      </div>
      <div className="flex flex-row bg-black/30 justify-between w-40 py-2 px-2   rounded-3xl">
        <img
          src="/assets/brand/onlyLogo.png"
          alt=""
          className="object-contain w-6"
        />
        <p>
          {formatCurrency({
            value: airdropInfo?.singleClaimableAmount,
            symbol: "NOWA",
          })}
        </p>
      </div>
      {!isConnected && (
        <div className="w-[95%] bg-primary flex justify-between mt-3 px-2 py-1 rounded-lg items-center">
          <div
            className="flex grow items-center justify-center cursor-pointer"
            onClick={() => {
              if (!isConnected) {
                open();
              }
            }}
          >
            <p className="text-black">Connect Wallet</p>
          </div>
        </div>
      )}
      {isConnected && (
        <div className="w-[95%] bg-primary flex justify-between mt-3 px-2 py-1 rounded-lg items-center">
          {airdropInfo?.isClaimable ? (
            <div
              className="flex grow items-center justify-center cursor-pointer"
              onClick={() => {
                if (!isConnected) {
                  open();
                }
                if (writeContractPending) {
                  return;
                }

                claimHandler();
              }}
            >
              <p className="text-black">
                {writeContractPending ? `Claiming..` : `Claim`}
              </p>
            </div>
          ) : (
            <>
              <p className="bg-black/30 w-12 h-8 text-center rounded-lg flex items-center justify-center">
                {hours}
              </p>
              <p className="text-black">:</p>
              <p className="bg-black/30 w-12 h-8 text-center rounded-lg flex items-center justify-center">
                {minutes}
              </p>
              <p className="text-black">:</p>
              <p className="bg-black/30 w-12 h-8 text-center rounded-lg flex items-center justify-center">
                {seconds}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AirDropClaim;
