"use client";

import {
  abi,
  AIRDROP_CONTRACT_ADDRESS,
  formatCurrency,
  NOWA_TOKEN,
  STAKING_CONTRACT_ADDRESS,
} from "@/const";
import { IconArrowRight } from "@tabler/icons-react";
import clsx from "clsx";
import React, { useMemo, useState } from "react";
import { erc20Abi } from "viem";
import { parseUnits, formatUnits } from "ethers";
import {
  useAccount,
  useBalance,
  useConfig,
  useReadContract,
  useWriteContract,
} from "wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { toast } from "sonner";
import { useAppKit } from "@reown/appkit/react";
import { useTimer } from "@/hooks/useTimer";
import moment from "moment";

const Stake = () => {
  const { address, isConnected } = useAccount();
  const { open } = useAppKit();
  const config = useConfig();

  const { writeContractAsync, isPending: writeContractPending } =
    useWriteContract();
  const { data: NowaBalance } = useBalance({
    address: address,
    token: NOWA_TOKEN?.address,
  });

  const { data: minStakeAmountData, refetch: minStakeAmountDataRefetch } =
    useReadContract({
      abi: abi.STAKING_ABI,
      account: address,
      address: STAKING_CONTRACT_ADDRESS,
      functionName: "minStakeAmount",
    });
  const { data: airdropInfoData, refetch: refetchAirDropInfo } =
    useReadContract({
      abi: abi.AIRDROP_ABI,
      account: address,
      address: AIRDROP_CONTRACT_ADDRESS,
      args: [address],
      functionName: "airdropInfo",
    });
  const { data: claimCooldownData, refetch: claimCooldownDataRefetch } =
    useReadContract({
      abi: abi.AIRDROP_ABI,
      account: address,
      address: AIRDROP_CONTRACT_ADDRESS,
      functionName: "claimCooldown",
    });

  const formattedDetails = useMemo(() => {
    const minStakeAmount = minStakeAmountData
      ? formatUnits(minStakeAmountData)
      : 0;
    const lastClaimTimeStamp = moment
      .unix(Number(airdropInfoData?.[2]))
      .add(Number(claimCooldownData), "seconds")
      ?.toDate();

    return {
      minAmount: minStakeAmount,
      claimRemainTime: lastClaimTimeStamp,
      isClaimable: moment()?.isSameOrAfter(moment(lastClaimTimeStamp)),
    };
  }, [minStakeAmountData, claimCooldownData, airdropInfoData]);

  const { seconds, minutes, hours, isRunning, restart } = useTimer(
    formattedDetails?.claimRemainTime,
    () => {
      console.log("hitted");

      refetchHandler();
    }
  );
  const refetchHandler = async () => {
    try {
      await minStakeAmountDataRefetch();
      await refetchAirDropInfo();
      await claimCooldownDataRefetch();
    } catch (error) {
      console.log(error);
    }
  };

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
      refetchHandler();
    } catch (error) {
      toast.error(error?.shortMessage || "Something went wrong");
      console.log(error);
      refetchHandler();
    }
  };

  return (
    <div className="col-span-12 md:col-span-9 lg:col-span-8 xl:col-span-6 row-span-8 bg-background p-8 rounded-2xl flex flex-col justify-center">
      <div className="flex flex-col md:flex-row items-center justify-between 2xl:px-14">
        <img
          src="/assets/brand/onlyLogo.png"
          alt=""
          className="object-contain h-56"
        />
        <div className=" md:h-[60%] flex flex-col justify-between mt-8 md:mt-0">
          <div className="bg-black/30 flex flex-row gap-2 p-2 w-48 justify-between items-center rounded-3xl">
            <img
              src="/assets/brand/onlyLogo.png"
              alt=""
              className="object-contain h-6"
            />
            <p className="text-xl">100.00 NOWA</p>
          </div>
          <div className=" bg-primary flex justify-between mt-3 px-2 py-1 rounded-lg items-center w-48 ">
            {formattedDetails?.isClaimable ? (
              <div
                className="grow flex items-center justify-center cursor-pointer"
                onClick={() => {
                  if (writeContractPending) {
                    return;
                  }
                  claimHandler();
                }}
              >
                <p className="text-black">
                  {writeContractPending ? `Processing...` : `Claim & Stake`}
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
        </div>
      </div>
    </div>
  );
};

export default Stake;
