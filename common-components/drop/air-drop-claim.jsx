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
import React, { useEffect, useMemo } from "react";
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
import { useAppKit } from "@reown/appkit/react";
import {
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";

const AirDropClaim = ({ flipped, setFlipped }) => {
  const config = useConfig();
  const { address, isConnected } = useAccount();
  const { open } = useAppKit();

  const { data: totalAirdropped, refetch: totalAirdroppedRefetch } =
    useReadContract({
      abi: abi.AIRDROP_ABI,
      address: AIRDROP_CONTRACT_ADDRESS,
      functionName: "totalAirdropped",
    });
  const { data: totalClaimAirdrop, refetch: totalClaimAirdropRefetch } =
    useReadContract({
      abi: abi.AIRDROP_ABI,
      address: AIRDROP_CONTRACT_ADDRESS,
      functionName: "totalClaimAirdrop",
    });

  const airdropInfo = useMemo(() => {
    const totalAirDrop = totalAirdropped ? formatUnits(totalAirdropped) : 0;
    const totalClaimedDrops = totalClaimAirdrop
      ? formatUnits(totalClaimAirdrop)
      : 0;

    const leftToClaimDrop = Number(totalAirDrop) - Number(totalClaimedDrops);

    const percentage =
      Number((Number(totalClaimedDrops) / Number(leftToClaimDrop)) * 100) || 0;

    return {
      totalAirDrop,
      totalClaimedDrops,
      leftToClaimDrop,
      percentage,
    };
  }, [totalAirdropped, totalClaimAirdrop]);

  const refetchHanlder = async () => {
    await totalAirdroppedRefetch();
    await totalClaimAirdropRefetch();
  };
  useEffect(() => {
    refetchHanlder();
  }, [flipped]);

  return (
    <div className="col-span-12 row-span-12 md:col-span-4 sm:row-span-6  xl:col-span-3 lg:row-span-8 bg-background rounded-2xl p-6 flex justify-between items-center flex-col">
      <h1 className="font-semibold">Airdrop Phase 1</h1>

      <div className="relative w-40 flex justify-center items-center   h-48">
        <CircularProgressbarWithChildren
          value={airdropInfo?.percentage}
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
          <p>
            {formatCurrency({
              value: airdropInfo?.totalClaimedDrops,
              symbol: "NOWA",
            })}
          </p>
        </div>
        <div className="flex flex-row justify-between w-full">
          <div className="flex flex-row gap-2">
            <div className="h-5 w-5 rounded-full bg-card" />
            <p>Left to Claim</p>
          </div>
          <p>
            {formatCurrency({
              value: airdropInfo?.leftToClaimDrop,
              symbol: "NOWA",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AirDropClaim;
