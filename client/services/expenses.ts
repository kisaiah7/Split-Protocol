import { FormData, ExpenseCategory } from '../pages/expenses/create';
import { ethers } from 'ethers';
import { TokenSymbol } from '../enums/TokenSymbol';
import { rawArrayToExpenses } from './expenseTransformator';
import { Token } from '@uniswap/sdk-core';
import { parseUnits } from '../utils/token-helper';
import { erc20ABI } from 'wagmi';

export interface DebtorModel {
  address: string;
  amount: number;
  amountOut: number;
  paidAt: Date;
  hasPaid: boolean;
}

export interface ExpenseModel {
  name: string;
  description: string;
  category: string;
  token: string;
  amount: number;
  amountPaid: number;
  paymentDue: Date;
  createdAt: Date;
  status: string;
  creator: string;
  recipient: string;
  debtors: DebtorModel[];
}

const tokenAddress: { [key: string]: string } =
  process.env.NODE_ENV !== 'production'
    ? {
        [TokenSymbol.USDT]: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        [TokenSymbol.WETH]: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        [TokenSymbol.USDC]: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        [TokenSymbol.DAI]: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        [TokenSymbol.WMATIC]: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
      }
    : {
        [TokenSymbol.USDT]: '0x3813e82e6f7098b9583FC0F33a962D02018B6803',
        [TokenSymbol.WETH]: '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa',
        [TokenSymbol.USDC]: '0xe11A86849d99F524cAC3E7A0Ec1241828e332C62',
        [TokenSymbol.DAI]: '0xd393b1E02dA9831Ff419e22eA105aAe4c47E1253',
        [TokenSymbol.WMATIC]: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
      };

class ExpenseService {
  async fetchCreatedExpenses(
    contract: ethers.Contract,
    wallet: string
  ): Promise<any[]> {
    try {
      if (wallet != null) {
        const res = await contract.getNumberOfCreatedExpenses(wallet);
        const numberOfCreatedExpenses = Number(res._hex);
        const promises = [];
        for (let i = 0; i < numberOfCreatedExpenses; i++) {
          promises.push(contract.getCreatedExpense(wallet, i));
        }

        return await Promise.all(promises);
      }
      return [];
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async fetchOwedExpense(
    contract: ethers.Contract,
    wallet: string,
    expenseIndex: number
  ): Promise<any[]> {
    const owedExpense = await contract.getOwedExpense(wallet, expenseIndex);
    return owedExpense;
  }

  async fetchOwedExpenses(
    contract: ethers.Contract,
    wallet: string
  ): Promise<any[]> {
    try {
      if (wallet != null) {
        const res = await contract.getNumberOfOwedExpenses(wallet);
        const numberOfCreatedExpenses = Number(res._hex);
        const promises = [];
        for (let i = 0; i < numberOfCreatedExpenses; i++) {
          promises.push(contract.getOwedExpense(wallet, i));
        }
        return await Promise.all(promises);
      }
      return [];
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async loadExpense(
    contract: ethers.Contract,
    wallet: string,
    expenseIndex: number
  ): Promise<ExpenseModel> {
    try {
      const owedExpense = await this.fetchOwedExpense(
        contract,
        wallet,
        expenseIndex
      );
      return rawArrayToExpenses([owedExpense])[0];
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async loadExpenses(
    contract: ethers.Contract,
    wallet: string
  ): Promise<ExpenseModel[]> {
    try {
      if (wallet != null) {
        const owedExpenses = await this.fetchOwedExpenses(contract, wallet);
        return rawArrayToExpenses(owedExpenses);
      }
      return [];
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async createExpense(
    creatorAddress: string,
    contract: ethers.Contract,
    formData: FormData
  ): Promise<number> {
    try {
      const {
        name,
        description,
        amount,
        token,
        category,
        paymentDue,
        recipientAddress,
        debtors,
      } = formData;

      const address = tokenAddress[token];
      const categoryIndex = Object.values(ExpenseCategory).findIndex(
        (expenseCategory) => expenseCategory === category
      );
      const recipient = {
        _address: recipientAddress,
      };
      const creator = {
        _address: creatorAddress,
      };
      const apiDebtors = debtors.map(({ address, amount }) => ({
        _address: address,
        amount,
      }));
      const txn = await contract.createExpense(
        name,
        description,
        amount,
        address,
        categoryIndex,
        paymentDue,
        recipient,
        creator,
        apiDebtors
      );
      console.log('Creating expense...', txn.hash);
      await txn.wait();
      console.log('Created expense');
      return 0;
    } catch (err) {
      console.error(err);
      return -1;
    }
  }

  async getLatestExpenseIndex(contract: ethers.Contract, address: string) {
    const owedExpensesCount = await contract.getNumberOfOwedExpenses(address);
    return owedExpensesCount - 1;
  }

  async payExpense(
    fromToken: Token,
    poolFee: number,
    amount: number,
    splitContract: ethers.Contract,
    signer: ethers.Signer,
    expenseIndex: number
  ): Promise<number> {
    try {
      const tokenContract = new ethers.Contract(
        fromToken.address,
        erc20ABI,
        signer
      );
      const parsedAmount = parseUnits(amount, fromToken.decimals);
      if (!process.env.NEXT_PUBLIC_SWAP_CONTRACT_ADDRESS)
        throw new Error('NEXT_PUBLIC_SWAP_CONTRACT_ADDRESS is undefined');
      await tokenContract.approve(
        process.env.NEXT_PUBLIC_SWAP_CONTRACT_ADDRESS,
        parsedAmount
      );
      const txn = await splitContract.payDebt(
        fromToken.address,
        poolFee,
        parsedAmount,
        expenseIndex
      );
      console.log('Transaction pending...');
      await txn.wait();
      console.log('Paid expense');
      return 0;
    } catch (err) {
      console.error('An error occurred trying to pay an expense', err);
      return -1;
    }
  }
}

const expenseService = new ExpenseService();
export default expenseService;
