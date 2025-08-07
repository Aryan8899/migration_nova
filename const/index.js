import { formatNice } from "coin-format";
import airDropAbi from "@/abi/air-drop.json";
import stakingAbi from "@/abi/staking.json";
export const STAKING_CONTRACT_ADDRESS =
  "0xD87a7c492597de7Fa36932250aC90331Da3Eb747";
export const AIRDROP_CONTRACT_ADDRESS =
  "0x65A5661917C607de6b357739CCB02F5787aB9e26";
export const NOWA_TOKEN = {
  address: "0xe4D48923cf6DD9Cfd201848a88D1F673e4753dC2",
};

export const abi = {
  AIRDROP_ABI: airDropAbi,
  STAKING_ABI: stakingAbi,
};

export const formatCurrency = ({ value, symbol }) => {
  return `${formatNice(value)} ${symbol ? symbol : ""}`;
};

export const base_url = "";
