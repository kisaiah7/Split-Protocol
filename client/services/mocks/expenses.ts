import mockFetch from './mock';
import { FormData, ExpenseCategory } from '../../pages/expense/create';
import { ethers } from 'ethers';
import { TokenSymbol } from '../../enums/TokenSymbol';
import { Token } from '@uniswap/sdk-core';
import { parseUnits } from '../../utils/token-helper';
import { erc20ABI } from 'wagmi';

const EXPENSE_DELAY = 3000; //in ms

export interface DebtorModel {
  name: string;
  share: string;
  payed: string;
  payedAt: string;
  status: string;
  address: string;
}

export interface ExpenseModel {
  user: string;
  name: string;
  created: string;
  recipientAddress: string;
  total: string;
  remaining: string;
  timeRemaining: string;
  status: string;
  description: string;
  debtors: DebtorModel[];
  category: string;
  token: string;
}

const tokenAddress: { [key: string]: string } = {
  [TokenSymbol.USDT]: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
  [TokenSymbol.WETH]: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
  [TokenSymbol.USDC]: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  [TokenSymbol.DAI]: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
  [TokenSymbol.WMATIC]: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
};

export function getExpenseData(): ExpenseModel {
  const debtor = {
    name: 'crypto-cat.eth',
    share: '1000 USDT',
    payed: '1 ETH',
    payedAt: '2022-07-15',
    status: 'paid',
    address: '0x123151231241123123',
  };
  const expense = {
    user: 'crypto-cat.eth',
    status: 'Pending',
    category: 'Transportation',
    token: 'usdt',
    name: 'Apartment Rent',
    created: '2022-07-03',
    recipientAddress: 'jon-apartments.eth',
    total: '2000 USDT',
    remaining: '1000 USDT',
    timeRemaining: '3 days',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam at tortor non imperdiet turpis volutpat neque, mattis...',
    debtors: [debtor, debtor],
  };

  return expense;
}

const expenses: ExpenseModel[] = new Array(30).fill(getExpenseData());

class ExpenseService {
  async loadExpensesPreviews(): Promise<ExpenseModel[]> {
    return mockFetch<ExpenseModel[]>(EXPENSE_DELAY, expenses);
  }

  async loadExpense(id: number): Promise<ExpenseModel> {
    return mockFetch<ExpenseModel>(EXPENSE_DELAY, expenses[id]);
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
