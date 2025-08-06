import { formatNice } from "coin-format";
import airDropAbi from "@/abi/air-drop.json";
import stakingAbi from "@/abi/staking.json";
export const STAKING_CONTRACT_ADDRESS =
  "0x9C09B18bc8317DcC40Eace7c72dC2146eB201585";
export const AIRDROP_CONTRACT_ADDRESS =
  "0x1038832698CA270f610eE728c0Ad901317ad3949";
export const NOWA_TOKEN = {
  address: "0xe4D48923cf6DD9Cfd201848a88D1F673e4753dC2",
};

export const abi = {
  AIRDROP_ABI: airDropAbi,
  STAKING_ABI: stakingAbi,
};

export const formatCurrency = ({ value, symbol }) => {
  return `${formatNice(value)} ${symbol}`;
};
