"use client";
import { useAppKit } from "@reown/appkit/react";
import { IconWallet } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";
import { useAccount } from "wagmi";

const Header = () => {
  const { open } = useAppKit();
  const { isConnected } = useAccount();

  return (
    <div className=" bg-sub-card">
      <div className="container mx-auto flex justify-between items-center">
        <Link href={"/"}>
          <img
            src="/assets/brand/Nowa logo horizonatal.svg"
            alt=""
            className="object-contain h-16 cursor-pointer"
          />
        </Link>
        {isConnected ? (
          <appkit-account-button />
        ) : (
          <button
            className="bg-background flex flex-row gap-2 h-12 items-center justify-center w-52 rounded-4xl cursor-pointer"
            onClick={open}
          >
            <IconWallet />
            <p> Connect Wallet</p>
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
