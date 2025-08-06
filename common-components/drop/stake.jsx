"use client";

import {
  abi,
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

const Stake = () => {
  const { address, isConnected } = useAccount();
  const { open } = useAppKit();
  const config = useConfig();

  const [fromValue, setFromValue] = useState("");
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

  const formattedDetails = useMemo(() => {
    const minStakeAmount = minStakeAmountData
      ? formatUnits(minStakeAmountData)
      : 0;

    return {
      minAmount: minStakeAmount,
    };
  }, [minStakeAmountData]);

  const refetchHanlder = async () => {};

  const stakeHandler = async () => {
    try {
      const amount = parseUnits(fromValue);
      const approveTxn = await writeContractAsync({
        abi: erc20Abi,
        account: address,
        address: NOWA_TOKEN.address,
        args: [STAKING_CONTRACT_ADDRESS, amount],
        functionName: "approve",
      });
      const transactionReceiptApproval = await waitForTransactionReceipt(
        config,
        {
          hash: approveTxn,
        }
      );

      if (transactionReceiptApproval?.transactionHash) {
        const tx = await writeContractAsync({
          abi: abi.STAKING_ABI,
          address: STAKING_CONTRACT_ADDRESS,
          args: [address, amount],
          functionName: "stake",
        });
        const transactionReceipt = await waitForTransactionReceipt(config, {
          hash: tx,
        });
      }

      toast.success("Claimed successfully");
      refetchHanlder();
    } catch (error) {
      toast.error(error?.shortMessage || "Something went wrong");
      console.log(error);
      refetchHanlder();
    }
  };

  const isValid = useMemo(() => {
    if (!fromValue) {
      return {
        isValid: false,
        message: "",
      };
    }
    if (Number(fromValue) < Number(formattedDetails?.minAmount)) {
      return {
        isValid: false,
        message: "Amount should be greater than min amount",
      };
    }
    if (Number(fromValue) > Number(NowaBalance?.formatted)) {
      return {
        isValid: false,
        message: "Amount exceed wallet balance",
      };
    }
    return {
      isValid: true,
      message: "",
    };
  }, [fromValue, formattedDetails, NowaBalance]);

  return (
    <div className="col-span-12 md:col-span-9 lg:col-span-8 xl:col-span-6 row-span-8 bg-background p-8 rounded-2xl flex flex-col justify-between">
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

        <button
          className={clsx(
            "flex bg-primary w-80 rounded-2xl h-10 items-center px-4 cursor-pointer",
            !isValid?.isValid && "bg-primary/50"
          )}
          onClick={() => {
            if (!isConnected) {
              open();
            }
            if (isValid?.isValid) {
              stakeHandler();
            }
          }}
        >
          {isConnected ? (
            <p className=" grow text-black">Stake</p>
          ) : (
            <p className=" grow text-black">Connect Wallet</p>
          )}
          <div className="bg-black/30 p-1 rounded-lg">
            <IconArrowRight color="black" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default Stake;
