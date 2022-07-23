import mockFetch from './mock';
import { FormData, ExpenseCategory } from '../../pages/expense/create';
import { Contract, ethers } from 'ethers';
import { PayFormData } from '../../components/pay';
import { TokenSymbol } from '../../enums/TokenSymbol';
import splitContract from '../../utils/abis/Split.json';
import { rawArrayToExpenses } from '../expenseTransformator';

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
  [TokenSymbol.USDT]: '0x3813e82e6f7098b9583FC0F33a962D02018B6803',
  [TokenSymbol.WETH]: '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa',
  [TokenSymbol.USDC]: '0xe11A86849d99F524cAC3E7A0Ec1241828e332C62',
  [TokenSymbol.DAI]: '0xd393b1E02dA9831Ff419e22eA105aAe4c47E1253',
  [TokenSymbol.WMATIC]: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
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
    contract: Contract,
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

  async payExpense(data: PayFormData): Promise<number> {
    return mockFetch<number>(EXPENSE_DELAY, 1);
  }
}

const expenseService = new ExpenseService();
export default expenseService;
