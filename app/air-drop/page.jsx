import { IconArrowRight } from "@tabler/icons-react";
import React from "react";

const Airdrop = () => {
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
      <div className="grid grid-cols-12 grid-rows-12 lg:h-[500px] gap-4 mt-20">
        <div className="col-span-12 row-span-12 lg:col-span-2 lg:row-span-8 bg-background rounded-2xl p-4 flex justify-start items-center flex-col">
          <h1 className="font-semibold">Get Airdrop</h1>

          <div className="relative w-40 flex justify-center items-center   h-48">
            <div className=" relative z-20 flex items-center justify-center flex-col">
              <p className="text-white">23653.4</p>
              <p className="text-second-text">Total Claimed</p>
            </div>
            <img
              src="/assets/drop/blur-bg.png"
              alt=""
              className="absolute z-10"
            />
          </div>
          <div className="flex flex-row bg-black/30 justify-between w-40 py-2 px-2   rounded-3xl">
            <img
              src="/assets/brand/onlyLogo.png"
              alt=""
              className="object-contain w-6"
            />
            <p>100.00 NOWA</p>
          </div>
          <div className="w-[95%] bg-primary flex justify-between mt-3 px-2 py-1 rounded-lg items-center">
            <p className="bg-black/30 w-12 h-8 text-center rounded-lg flex items-center justify-center">
              08
            </p>
            <p className="text-black">:</p>
            <p className="bg-black/30 w-12 h-8 text-center rounded-lg flex items-center justify-center">
              34
            </p>
            <p className="text-black">:</p>
            <p className="bg-black/30 w-12 h-8 text-center rounded-lg flex items-center justify-center">
              52
            </p>
          </div>
        </div>
        <div className="col-span-12 sm:col-span-3 row-span-4 bg-background p-4 rounded-2xl flex items-start flex-col justify-center gap-4">
          <h1>Annual Percentage Yield</h1>
          <p className="text-4xl font-semibold">5%</p>
        </div>
        <div className="col-span-12 sm:col-span-9 lg:col-span-7 row-span-8 bg-background p-8 rounded-2xl flex flex-col justify-between">
          <div className="flex flex-col gap-2">
            <p>Staking Amount</p>
            <input
              type="text"
              className="bg-sub-card w-full h-12 rounded-2xl mt-1 px-4"
              placeholder="Amount"
            />
          </div>
          <div className="flex justify-between items-center flex-row">
            <p>Min: 100 NOWA</p>

            <button className="flex bg-primary w-80 rounded-2xl h-10 items-center px-4 cursor-pointer">
              <p className=" grow text-black">Stake</p>
              <div className="bg-black/30 p-1 rounded-lg">
                <IconArrowRight color="black" />
              </div>
            </button>
          </div>
        </div>
        <div className="col-span-12 sm:col-span-3 row-span-4 bg-background p-4 rounded-2xl flex items-start flex-col justify-center gap-4">
          <h1>Total Staked Users</h1>
          <p className="text-4xl font-semibold">5,750</p>
        </div>
        <div className="col-span-12 sm:col-span-4 row-span-4 bg-background p-8 rounded-2xl flex items-start flex-col justify-center gap-4">
          <h1>Total Staked</h1>
          <p className="text-4xl font-semibold">50,750 NOWA</p>
        </div>
        <div className="col-span-12 sm:col-span-8 row-span-4 bg-background p-8 rounded-2xl flex flex-col justify-center">
          <div className="flex justify-between items-center flex-row">
            <div className="flex flex-col gap-4">
              <h1>Total Staked Users</h1>
              <p className="text-4xl font-semibold">5,750 NOWA</p>
            </div>
            <button className="flex bg-primary w-56 rounded-2xl h-10 items-center px-4 cursor-pointer">
              <p className=" grow text-black">Claim</p>
              <div className="bg-black/30 p-1 rounded-lg">
                <IconArrowRight color="black" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Airdrop;
/* Rectangle 7605 */
