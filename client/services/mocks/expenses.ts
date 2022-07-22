import mockFetch from './mock';
import { FormData, ExpenseCategory } from '../../pages/expense/create';
import { Contract } from 'ethers';
import { PayFormData } from '../../components/pay';
import { TokenSymbol } from '../../enums/TokenSymbol';

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
  [TokenSymbol.USDT]: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
  [TokenSymbol.WETH]: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
  [TokenSymbol.USDC]: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
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
