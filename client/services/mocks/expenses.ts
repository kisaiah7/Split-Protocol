import mockFetch from "./mock";
import { FormData } from "../../pages/expense/create";

const EXPENSE_DELAY = 3000;//in ms

export interface DebtorModel {
    name: string,
    share: string,
    payed: string,
    payedAt: string,
    status: string,
    address: string,
}

export interface ExpenseModel {
    user: string,
    name: string,
    created: string,
    recipientAddress: string,
    total: string,
    remaining: string,
    timeRemaining: string,
    status: string,
    description: string,
    debtors: DebtorModel[],
}

export function getExpenseData(): ExpenseModel {
    const debtor = {
        name: 'crypto-cat.eth',
        share: '1000 USDT',
        payed: '1 ETH',
        payedAt: '2022-07-15',
        status: 'paid',
        address: '0x123151231241123123',
    }
    const expense = {
        user: 'crypto-cat.eth',
        status: 'Pending',
        catergoy: 'Car',
        token: 'usdt',
        name: 'Apartment Rent',
        created: '2022-07-03',
        recipientAddress: 'jon-apartments.eth',
        total: '2000 USDT',
        remaining: '1000 USDT',
        timeRemaining: '3 days',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam at tortor non imperdiet turpis volutpat neque, mattis...',
        debtors: [
            debtor,
            debtor
        ]
    }

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

    async createExpense(data: FormData): Promise<number> {
        return mockFetch<number>(EXPENSE_DELAY, 1);
    }
}

const expenseService = new ExpenseService();
export default expenseService;