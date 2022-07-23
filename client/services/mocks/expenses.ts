import mockFetch from './mock';
import { FormData, ExpenseCategory } from '../../pages/expense/create';
import { Contract, ethers } from 'ethers';
import { PayFormData } from '../../components/pay';
import { TokenSymbol } from '../../enums/TokenSymbol';
import splitContract from '../../utils/abis/Split.json';
import { rawArrayToExpenses } from '../expenseTransformator';
import { Token } from '@uniswap/sdk-core';
import { parseUnits } from '../../utils/token-helper';
import { erc20ABI } from 'wagmi';

const EXPENSE_DELAY = 3000; //in ms

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

const tokenAddress: { [key: string]: string } = {
  [TokenSymbol.USDT]: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
  [TokenSymbol.WETH]: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
  [TokenSymbol.USDC]: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  [TokenSymbol.DAI]: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
  [TokenSymbol.WMATIC]: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
};

export function getExpenseData(): ExpenseModel {
  const debtor: DebtorModel = {
    amount: 1,
    amountOut: 1,
    paidAt: new Date(),
    hasPaid: true,
    address: '0x123151231241123123',
  };
  const expense = {
    name: 'Apartment Rent',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam at tortor non imperdiet turpis volutpat neque, mattis...',
    category: 'Transportation',
    token: 'usdt',
    amount: 1,
    amountPaid: 1,
    paymentDue: new Date(),
    createdAt: new Date(),
    status: 'Paid',
    creator: '0x123213asdasdas12321ff',
    recipient: '0x12412319asfasd',
    debtors: [debtor, debtor],
  };

  return expense;
}

const expenses: ExpenseModel[] = new Array(30).fill(getExpenseData());

const contract = new ethers.Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!, splitContract.abi,
  ethers.Wallet.createRandom().connect(new ethers.providers.AlchemyProvider("maticmum", process.env.NEXT_PUBLIC_ALCHEMY_API_KEY)));


class ExpenseService {
  async loadExpensesPreviews(): Promise<ExpenseModel[]> {
    return mockFetch<ExpenseModel[]>(EXPENSE_DELAY, expenses);
  }

  async loadExpense(id: number): Promise<ExpenseModel> {
    return mockFetch<ExpenseModel>(EXPENSE_DELAY, expenses[id]);
  }

  async fetchCreatedExpenses(wallet: string): Promise<any[]> {
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

  async fetchOwedExpenses(wallet: string): Promise<any[]> {
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

  async loadExpenses(wallet: string): Promise<ExpenseModel[]> {
    try {
      if (wallet != null) {
        const owedExpenses = await this.fetchOwedExpenses(wallet);
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
