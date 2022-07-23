import { ethers } from 'ethers';
import { Pool } from '@uniswap/v3-sdk';
import { Token } from '@uniswap/sdk-core';
import IUniswapV3PoolArtifact from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';
import { useContract, useProvider } from 'wagmi';
import { PoolImmutables } from '../models/pool-immutables';
import { PoolState } from '../models/pool-state';
import { TokenImmutables } from '../models/token-immutables';
import { polygonMumbai } from 'wagmi/chains';
import { useRef, useState } from 'react';
import QuoterArtifact from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json';
import { TokenSymbol } from '../enums/TokenSymbol';
import { formatUnits, parseUnits } from '../utils/token-helper';
import { erc20ABI } from 'wagmi';

const USDC_WETH_POOL_CONTRACT_ADDRESS =
  '0x45dda9cb7c25131df268515131f647d726f50608';
const WMATIC_WETH_POOL_CONTRACT_ADDRESS =
  '0x167384319b41f7094e62f7506409eb38079abff8';
const WMATIC_USDC_POOL_CONTRACT_ADDRESS =
  '0xa374094527e1673a86de625aa59517c5de346d32';
const USDC_DAI_POOL_CONTRACT_ADDRESS =
  '0x5645dcb64c059aa11212707fbf4e7f984440a8cf';
const USDC_USDT_POOL_CONTRACT_ADDRESS =
  '0xdac8a8e6dbf8c690ec6815e0ff03491b2770255d';
const QUOTER_CONTRACT_ADDRESS = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6';

const pools: {
  tokenSymbolPair: [string, string];
  poolContractAddress: string;
}[] = [
  {
    tokenSymbolPair: [TokenSymbol.USDC, TokenSymbol.WETH],
    poolContractAddress: USDC_WETH_POOL_CONTRACT_ADDRESS,
  },
  {
    tokenSymbolPair: [TokenSymbol.WMATIC, TokenSymbol.WETH],
    poolContractAddress: WMATIC_WETH_POOL_CONTRACT_ADDRESS,
  },
  {
    tokenSymbolPair: [TokenSymbol.WMATIC, TokenSymbol.USDC],
    poolContractAddress: WMATIC_USDC_POOL_CONTRACT_ADDRESS,
  },
  {
    tokenSymbolPair: [TokenSymbol.USDC, TokenSymbol.DAI],
    poolContractAddress: USDC_DAI_POOL_CONTRACT_ADDRESS,
  },
  {
    tokenSymbolPair: [TokenSymbol.USDC, TokenSymbol.USDT],
    poolContractAddress: USDC_USDT_POOL_CONTRACT_ADDRESS,
  },
];

const useSwap = () => {
  const provider = useProvider();
  const quoterContract = useContract({
    addressOrName: QUOTER_CONTRACT_ADDRESS,
    contractInterface: QuoterArtifact.abi,
    signerOrProvider: provider,
  });

  const [fromTokenPrice, setFromTokenPrice] = useState<string | null>(null);
  const [toTokenPrice, setToTokenPrice] = useState<string | null>(null);

  const fromTokenRef = useRef<Token | null>(null);
  const toTokenRef = useRef<Token | null>(null);
  const poolRef = useRef<Pool | null>(null);

  const changePool = async (fromTokenSymbol: string, toTokenSymbol: string) => {
    try {
      const poolContractAddress = getPoolContractAddress(
        fromTokenSymbol,
        toTokenSymbol
      );
      const poolContract = createPoolContract(poolContractAddress);

      const [immutables, state] = await Promise.all([
        getPoolImmutables(poolContract),
        getPoolState(poolContract),
      ]);

      const token0Contract = createTokenContract(immutables.token0);
      const token1Contract = createTokenContract(immutables.token1);

      const [token0, token1] = await Promise.all([
        createToken(token0Contract),
        createToken(token1Contract),
      ]);

      const pool = new Pool(
        token0,
        token1,
        immutables.fee,
        state.sqrtPriceX96.toString(),
        state.liquidity.toString(),
        state.tick
      );
      poolRef.current = pool;

      let fromTokenPrice, toTokenPrice;

      if (fromTokenSymbol === token0.symbol) {
        fromTokenRef.current = token0;
        toTokenRef.current = token1;
        fromTokenPrice = pool.token0Price.toFixed(token1.decimals);
        toTokenPrice = pool.token1Price.toFixed(token0.decimals);
      } else {
        fromTokenRef.current = token1;
        toTokenRef.current = token0;
        fromTokenPrice = pool.token1Price.toFixed(token0.decimals);
        toTokenPrice = pool.token0Price.toFixed(token1.decimals);
      }

      setFromTokenPrice(fromTokenPrice);
      setToTokenPrice(toTokenPrice);
    } catch (err) {
      console.error('Error trying to initialize a pool', err);
      throw err;
    }
  };

  const getPoolContractAddress = (
    fromTokenSymbol: string,
    toTokenSymbol: string
  ) => {
    const pool = pools.find(
      (pool) =>
        pool.tokenSymbolPair.includes(fromTokenSymbol) &&
        pool.tokenSymbolPair.includes(toTokenSymbol)
    );
    if (!pool)
      throw new Error('No pool could be found for the selected tokens');
    return pool.poolContractAddress;
  };

  const createPoolContract = (poolContractAddress: string) => {
    const poolContract = new ethers.Contract(
      poolContractAddress,
      IUniswapV3PoolArtifact.abi,
      provider
    );
    return poolContract;
  };

  const getPoolImmutables = async (poolContract: ethers.Contract) => {
    const [factory, token0, token1, fee, tickSpacing, maxLiquidityPerTick] =
      await Promise.all([
        poolContract.factory(),
        poolContract.token0(),
        poolContract.token1(),
        poolContract.fee(),
        poolContract.tickSpacing(),
        poolContract.maxLiquidityPerTick(),
      ]);

    const poolImmutables: PoolImmutables = {
      factory,
      token0,
      token1,
      fee,
      tickSpacing,
      maxLiquidityPerTick,
    };
    return poolImmutables;
  };

  const getPoolState = async (poolContract: ethers.Contract) => {
    const [liquidity, slot] = await Promise.all([
      poolContract.liquidity(),
      poolContract.slot0(),
    ]);

    const PoolState: PoolState = {
      liquidity,
      sqrtPriceX96: slot[0],
      tick: slot[1],
      observationIndex: slot[2],
      observationCardinality: slot[3],
      observationCardinalityNext: slot[4],
      feeProtocol: slot[5],
      unlocked: slot[6],
    };

    return PoolState;
  };

  const createTokenContract = (tokenContractAddress: string) => {
    const tokenContract = new ethers.Contract(
      tokenContractAddress,
      erc20ABI,
      provider
    );
    return tokenContract;
  };

  const createToken = async (
    tokenContract: ethers.Contract,
    chain = polygonMumbai
  ) => {
    const tokenImmutables = await getTokenImmutables(tokenContract);
    const token = new Token(
      chain.id,
      tokenContract.address,
      tokenImmutables.decimals,
      tokenImmutables.symbol,
      tokenImmutables.name
    );
    return token;
  };

  const getTokenImmutables = async (tokenContract: ethers.Contract) => {
    const [decimals, symbol, name] = await Promise.all([
      tokenContract.decimals(),
      tokenContract.symbol(),
      tokenContract.name(),
    ]);

    const tokenImmutables: TokenImmutables = {
      decimals,
      symbol,
      name,
    };

    return tokenImmutables;
  };

  const getQuoteReverse = async (amountOut: number) => {
    try {
      const pool = poolRef.current;
      if (!pool) throw new Error('pool is undefined');

      const fromToken = fromTokenRef.current;
      if (!fromToken) throw new Error('fromToken is undefined');

      const toToken = toTokenRef.current;
      if (!toToken) throw new Error('toToken is undefined');

      const parsedAmountOut = parseUnits(amountOut, toToken.decimals);

      const amountIn = await quoterContract.callStatic.quoteExactOutputSingle(
        fromToken.address,
        toToken.address,
        pool.fee,
        parsedAmountOut.toString(),
        0
      );

      const formattedAmountIn = formatUnits(amountIn, fromToken.decimals);
      return formattedAmountIn;
    } catch (err) {
      console.error('Error trying to get a quote', err);
      throw err;
    }
  };

  return {
    fromToken: fromTokenRef.current,
    toToken: toTokenRef.current,
    pool: poolRef.current,
    fromTokenPrice,
    toTokenPrice,
    changePool,
    getQuoteReverse,
  };
};
export default useSwap;
