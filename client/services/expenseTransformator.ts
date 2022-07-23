import { DebtorModel, ExpenseModel } from './expenses';

const CATEGORIES = [
  'Accommodation',
  'Transportation',
  'Food and Drinks',
  'Misc',
];
const TOKEN_BY_ADDRESS: { [key: string]: string } = {
  '0xc2132D05D31c914a87C6611C10748AEb04B58e8F': 'USDT',
  '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619': 'WETH',
  '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174': 'USDC',
  '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063': 'DAI',
  '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270': 'WMATIC',
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
    paidAt,
  };
  return debtor;
}

export function transformRawDebtorArray(raw: any[]): DebtorModel[] {
  return raw.map((debtor) => {
    return transformDebtorData(debtor);
  });
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
  const paymentDue = new Date(Number(raw[5]) * 1000);
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
    debtors,
  };
  return expense;
}

export function rawArrayToExpenses(raw: any[]): ExpenseModel[] {
  return raw.map((expense) => {
    return rawDataToExpense(expense);
  });
}

export function transformExpenses(arr: any[]) {
  return arr.map((rawExpense) => {
    return rawDataToExpense(rawExpense);
  });
}
