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
  [TokenSymbol.USDT]: '0x3813e82e6f7098b9583FC0F33a962D02018B6803',
  [TokenSymbol.WETH]: '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa',
  [TokenSymbol.USDC]: '0xe11A86849d99F524cAC3E7A0Ec1241828e332C62',
  [TokenSymbol.DAI]: '0xd393b1E02dA9831Ff419e22eA105aAe4c47E1253',
  [TokenSymbol.WMATIC]: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
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
