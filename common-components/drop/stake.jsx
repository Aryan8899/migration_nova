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
import React, { useEffect, useMemo, useState } from "react";
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
import moment from "moment";
import { queryClient } from "@/providers/blockchain-provider";
import { useTimer } from "react-timer-hook";

const Stake = ({ flipped, setFlipped }) => {
  const { address, isConnected } = useAccount();
  const [claimTime, setClaimTime] = useState(null);
  const [isClaimable, setIsClaimable] = useState(false);
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
  const { data: claimAmountData, refetch: claimAmountDataRefetch } =
    useReadContract({
      abi: abi.AIRDROP_ABI,
      account: address,
      address: AIRDROP_CONTRACT_ADDRESS,
      functionName: "claimAmount",
    });

  const { seconds, minutes, hours, restart, start } = useTimer({
    expiryTimestamp: claimTime,
    onExpire: () => {
      setIsClaimable(true);
      refetchHandler();
    },
    autoStart: false,
  });

  const formattedDetails = useMemo(() => {
    const minStakeAmount = minStakeAmountData
      ? formatUnits(minStakeAmountData)
      : 0;
    const lastClaimTimeStamp = moment
      .unix(Number(airdropInfoData?.[2]))
      .add(Number(claimCooldownData), "seconds")
      ?.toDate();
    setIsClaimable(moment()?.isSameOrAfter(moment(lastClaimTimeStamp)));
    setClaimTime(lastClaimTimeStamp);
    restart(lastClaimTimeStamp);
    return {
      minAmount: minStakeAmount,
      claimRemainTime: lastClaimTimeStamp,

      singleClaimableAmount: claimAmountData ? formatUnits(claimAmountData) : 0,
    };
  }, [minStakeAmountData, claimCooldownData, airdropInfoData, claimAmountData]);

  const refetchHandler = async () => {
    try {
      await minStakeAmountDataRefetch();
      await refetchAirDropInfo();
      await claimCooldownDataRefetch();
      await claimAmountDataRefetch();
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
    } finally {
      setFlipped((e) => !e);
    }
  };
  useEffect(() => {
    refetchHandler();
  }, [flipped]);

  return (
    <div className="col-span-12 md:col-span-9 lg:col-span-8 xl:col-span-6 row-span-8 bg-background p-8 rounded-2xl flex flex-col justify-center ">
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
            <p className="text-xl">
              {formatCurrency({
                value: formattedDetails?.singleClaimableAmount,
                symbol: "NOWA",
              })}
            </p>
          </div>
          <div className=" bg-primary flex justify-between mt-3 px-2 h-10 rounded-2xl items-center w-48 ">
            {isConnected ? (
              <>
                {isClaimable ? (
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
                      {String(hours)?.padStart(2, 0)}
                    </p>
                    <p className="text-black">:</p>
                    <p className="bg-black/30 w-12 h-8 text-center rounded-lg flex items-center justify-center">
                      {String(minutes)?.padStart(2, 0)}
                    </p>
                    <p className="text-black">:</p>
                    <p className="bg-black/30 w-12 h-8 text-center rounded-lg flex items-center justify-center">
                      {String(seconds)?.padStart(2, 0)}
                    </p>
                  </>
                )}
              </>
            ) : (
              <>
                <div
                  className="grow flex items-center justify-center cursor-pointer  w-48 "
                  onClick={() => {
                    open();
                  }}
                >
                  <p className="text-black">Connect Wallet</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stake;
