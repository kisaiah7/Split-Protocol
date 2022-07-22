import { ethers } from 'ethers';

export const parseUnits = (value: number, decimals: number) => {
  return ethers.utils.parseUnits(value.toString(), decimals);
};

export const formatUnits = (value: number, decimals: number) => {
  return ethers.utils.formatUnits(value, decimals);
};
