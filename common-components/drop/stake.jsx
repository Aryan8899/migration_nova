"use client";

import { abi, formatCurrency, STAKING_CONTRACT_ADDRESS } from "@/const";
import { IconArrowRight } from "@tabler/icons-react";
import React, { useMemo, useState } from "react";
import { formatUnits } from "viem";
import { useAccount, useReadContract } from "wagmi";

const Stake = () => {
  const { address } = useAccount();
  const [fromValue, setFromValue] = useState("");
  const { data: minStakeAmountData, refetch: minStakeAmountDataRefetch } =
    useReadContract({
      abi: abi.STAKING_ABI,
      account: address,
      address: STAKING_CONTRACT_ADDRESS,
      functionName: "minStakeAmount",
    });

  const formattedDetails = useMemo(() => {
    const minStakeAmount = minStakeAmountData
      ? formatUnits(minStakeAmountData)
      : 0;

    return {
      minAmount: minStakeAmount,
    };
  }, [minStakeAmountData]);

  const isValid = useMemo(() => {
    if (Number(fromValue) > Number(formattedDetails?.minAmount)) {
      return {
        isValid: false,
        message: "Amount exceed wallet balance.",
      };
    }
    return {
      isValid: false,
      message: "",
    };
  }, [fromValue, formattedDetails]);
  console.log(isValid, "asdasdasd");

  return (
    <div className="col-span-12 md:col-span-9 lg:col-span-8 xl:col-span-7 row-span-8 bg-background p-8 rounded-2xl flex flex-col justify-between">
      <div className="flex flex-col gap-2">
        <p>Staking Amount</p>
        <div>
          <input
            type="text"
            className="bg-sub-card w-full h-12 rounded-2xl mt-1 px-4"
            placeholder="Amount"
            value={fromValue}
            onChange={(e) => {
              const val = e?.target?.value;
              const decimal = 8;
              const regex = new RegExp(`^(\\d*(\\.\\d{0,${decimal}})?)?$`);
              if (regex.test(val)) {
                setFromValue(val);
              }
            }}
          />
          <p className="text-red-500/90 text-xs mt-2">{isValid?.message}</p>
        </div>
      </div>
      <div className="flex justify-between items-center flex-col md:flex-row gap-4 md:gap-0 mt-4 md:mt-0">
        <p>
          Min:{" "}
          {formatCurrency({
            value: formattedDetails?.minAmount,
            symbol: "NOWA",
          })}
        </p>

        <button className="flex bg-primary w-80 rounded-2xl h-10 items-center px-4 cursor-pointer">
          <p className=" grow text-black">Stake</p>
          <div className="bg-black/30 p-1 rounded-lg">
            <IconArrowRight color="black" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default Stake;
