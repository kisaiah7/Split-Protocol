import { DebtorModel, ExpenseModel } from "./mocks/expenses";

const CATEGORIES = ['Accommodation', 'Transportation', 'Food and Drinks', 'Misc']
const TOKEN_BY_ADDRESS: { [key: string]: string } = {
    '0x3813e82e6f7098b9583FC0F33a962D02018B6803':'USDT',
    '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa':'WETH',
    '0xe11A86849d99F524cAC3E7A0Ec1241828e332C62':'USDC',
    '0xd393b1E02dA9831Ff419e22eA105aAe4c47E1253':'DAI',
    '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889':'WMATIC',
  };

export function transformDebtorData(raw: any[]): DebtorModel {
    const address = raw[0];
    const amount = Number(raw[1]);
    const amountOut = Number(raw[2]);
    const hasPaid = raw[3];
    const paidAt = new Date(Number(raw[4]) * 1000);
    const debtor: DebtorModel = {
        address,
        amount,
        amountOut,
        hasPaid,
        paidAt
    }
    return debtor;
}

export function transformRawDebtorArray(raw: any[]): DebtorModel[] {
    return raw.map((debtor) => { return transformDebtorData(debtor) })
}

function sumDebtorPayments(debtors: DebtorModel[]): number {
    let sum = 0;
    for (let i = 0; i < debtors.length; i++) {
        sum += debtors[i].amountOut;
    }
    return sum;
}

export function rawDataToExpense(raw: any[]): ExpenseModel {
    const name = raw[0];
    const description = raw[1];
    const category = CATEGORIES[Number(raw[2])];
    const token = TOKEN_BY_ADDRESS[raw[3]];
    const amount = Number(raw[4]);
    const paymentDue = new Date(Number(raw[5]) * 1000)
    const createdAt = new Date(Number(raw[6]) * 1000);
    const status = raw[7];
    const creator = raw[8];
    const recipient = raw[9];
    const debtors = transformRawDebtorArray(raw[10]);
    const amountPaid = sumDebtorPayments(debtors);
    // console.log('name', name)
    // console.log('description', description)
    // console.log('category', category)
    // console.log('token', token)
    // console.log('amount', amount)
    // console.log('paymentDue', paymentDue)
    // console.log('createdAt', createdAt)
    // console.log('status', status)
    // console.log('creator', creator)
    // console.log('recipient', recipient)
    // console.log('debtors', debtors);
    const expense: ExpenseModel = {
        name,
        description,
        category,
        token,
        amount,
        paymentDue,
        createdAt,
        status,
        creator,
        recipient,
        amountPaid,
        debtors
    };
    return expense;
}

export function rawArrayToExpenses(raw: any[]): ExpenseModel[] {
    return raw.map((expense) => { return rawDataToExpense(expense) });
}

export function transformExpenses(arr: any[]) {
    return arr.map((rawExpense) => { return rawDataToExpense(rawExpense) });
}