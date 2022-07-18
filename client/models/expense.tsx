interface Expense {
  name: string;
  description: string;
  category: "accommodation" | "transportation" | "food and drinks" | "misc";
  token: string;
  paymentDue: number;
  status: "pending" | "paid" | "cancelled";
  createdOn: number;
  amount: number;
  recipient: {
    name: string;
  };
  debtors: {
    address: string;
    name: string;
    avatarURL: string;
    amount: number;
    token: string;
    paidOn: number;
  }[];
}

export default Expense;
