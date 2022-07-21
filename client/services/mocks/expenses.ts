import mockFetch from './mock';
import { FormData, ExpenseCategory } from '../../pages/expense/create';
import { Contract } from 'ethers';
import { PayFormData } from '../../components/pay';

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
    data: FormData
  ): Promise<number> {
    try {
      const {
        name,
        description,
        amount,
        category,
        paymentDue,
        recipientAddress,
        debtors,
      } = data;

      // USDT token address
      // TODO Selected one from the form should be used at a later point in time.
      const tokenAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
      const categoryIndex = Object.values(ExpenseCategory).findIndex(
        (expenseCategory) => expenseCategory === category
      );
      const recipient = {
        _address: recipientAddress,
        name: 'recipient',
        avatarURL: 'url',
      };
      const creator = {
        _address: creatorAddress,
        name: 'creator',
        avatarURL: 'url',
      };
      const apiDebtors = debtors.map(({ address, amount }) => ({
        _address: address,
        name: 'debtor',
        avatarURL: 'url',
        amount,
        hasPaid: false,
        paidAt: 0,
      }));
      await contract.createExpense(
        name,
        description,
        amount,
        tokenAddress,
        categoryIndex,
        paymentDue,
        recipient,
        creator,
        apiDebtors
      );
      return 0;
    } catch (err) {
      return -1;
    }
  }

  async payExpense(data: PayFormData): Promise<number> {
    return mockFetch<number>(EXPENSE_DELAY, 1);
  }
}

const expenseService = new ExpenseService();
export default expenseService;
