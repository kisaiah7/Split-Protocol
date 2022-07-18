import type { NextPage } from "next";
import Image from "next/image";
import cryptocat from "../../public/cryptocat.png";
// @ts-ignore
import houseIcon from "../../public/house-icon.svg";
// @ts-ignore
import foodIcon from "../../public/food-icon.svg";
// @ts-ignore
import carIcon from "../../public/car-icon.svg";
// @ts-ignore
import coinsIcon from "../../public/coins-icon.svg";
import Expense from "../../models/expense";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import Pay from "../../components/pay";
import axios from "axios";

type ExpenseData = Expense;

const View: NextPage = () => {
  const { address } = useAccount();

  const [daysRemaining, setDaysRemaining] = useState(0);
  const [bgColor, setBgColor] = useState("bg-misc-gradient");
  const [bgIcon, setBgIcon] = useState(coinsIcon);
  const [debtorData, setDebtorData] = useState({
    address: "",
    name: "",
    avatarURL: "",
    amount: 0,
  });
  const [expenseData, setExpenseData] = useState<ExpenseData>({
    name: "",
    description: "",
    category: "accommodation",
    token: "",
    paymentDue: 0,
    status: "pending",
    createdOn: 0,
    amount: 0,
    recipient: {
      name: "",
    },
    debtors: [
      {
        address: "",
        name: "",
        avatarURL: "",
        amount: 0,
        token: "",
        paidOn: 0,
      },
    ],
  });

  useEffect(() => {
    if (!address) return;

    // TODO make axios call
    /*
    axios.get("").then(() => {
      setExpenseData({});
    });
    */

    // To calculate the Time Remaining
    const paymentDueDate = new Date(expenseData.paymentDue);
    const todaysDate = new Date();
    // To calculate the time difference of two dates
    const timeRemaining = paymentDueDate.getTime() - todaysDate.getTime();
    // To calculate the no. of days between two dates
    setDaysRemaining(timeRemaining / (1000 * 3600 * 24));

    // Set the image/bg color depending on category
    // TODO fix case
    switch (expenseData.category as any) {
      case "accommodation":
        setBgColor("bg-accommodation-gradient");
        setBgIcon(houseIcon);
        break;
      case "transportation":
        setBgColor("bg-transportation-gradient");
        setBgIcon(carIcon);
        break;
      case "food and drinks":
        setBgColor("bg-foodanddrinks-gradient");
        setBgIcon(foodIcon);
        break;
      case "misc":
        setBgColor("bg-misc-gradient");
        setBgIcon(coinsIcon);
        break;
      default:
        setBgColor("bg-misc-gradient");
        setBgIcon(coinsIcon);
        break;
    }

    for (let debtor of expenseData.debtors) {
      if (debtor.address == address) {
        setDebtorData(debtor);
      }
    }
  });

  return (
    <div className="h-screen bg-body-gradient flex flex-col items-center justify-center">
      <Pay />
      <div className="container flex flex-row items-end">
        <div
          className={`rounded-lg w-96 h-64 flex items-center justify-center ${bgColor}`}
        >
          <Image src={bgIcon} className="bg-white" width={100} height={100} />
        </div>

        <div className="flex flex-col ml-7">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center">
              <Image src={cryptocat} width={24} height={24} />
              <p className="ml-2 text-primary text-sm">
                {debtorData.avatarURL}
              </p>
            </div>
          </div>

          <p className="font-sans text-primary text-4xl font-bold mt-1">
            {expenseData.name}
          </p>

          <div className="flex flex-row mb-2 mt-5 text-primary">
            <div className="text-center">
              <p className="text-muted font-bold text-2xs tracking-widest">
                CREATED
              </p>
              <p className="text-sm mt-1">{expenseData.createdOn}</p>
            </div>

            <div className="text-center ml-3">
              <p className="text-muted font-bold text-2xs tracking-widest">
                RECIPIENT
              </p>
              <p className="text-sm mt-1">{expenseData.recipient.name}</p>
            </div>

            <div className="text-center ml-3">
              <p className="text-muted font-bold text-2xs tracking-widest">
                TOTAL
              </p>
              <p className="text-sm mt-1">
                {expenseData.amount} {expenseData.token}
              </p>
            </div>

            <div className="text-center ml-3">
              <p className="text-muted font-bold text-2xs tracking-widest">
                REMAINING
              </p>
              <p className="text-sm mt-1">1000 {expenseData.token}</p>
            </div>

            <div className="text-center ml-3">
              <p className="text-muted font-bold text-2xs tracking-widest">
                TIME REMAINING
              </p>
              <p className="text-sm mt-1">{daysRemaining} days</p>
            </div>
          </div>

          <p className="text-secondary font-normal mt-2 text-xs tracking-wide">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam at
            tortor non imperdiet turpis volutpat neque, mattis...
          </p>

          <button className="mt-4 flex flex-row items-center text-primary w-fit bg-btn-gradient rounded-md px-3 py-2">
            <Image
              className="text-primary"
              src={coinsIcon}
              width={24}
              height={24}
            />
            <a className="ml-2">Pay Share</a>
          </button>
        </div>
      </div>

      <div className="mt-10 container">
        <p className="text-left font-sans text-3xl text-primary font-bold">
          Debtors
        </p>
        <div className="bg-secondary p-5 mt-5 rounded-lg">
          <div className="text-muted text-2xs font-light tracking-widest grid grid-cols-5">
            <p className="pl-8 inline-block">NAME</p>
            <p className="inline-block">SHARE</p>
            <p className="inline-block">PAYED</p>
            <p className="inline-block">PAYED AT</p>
            <p className="inline-block">STATUS</p>
          </div>
          {expenseData.debtors.map((debtor) => (
            <div className="py-5 border-b-2 border-tertiary flex flex-row items-center text-primary text-xs tracking-wide grid grid-cols-5">
              <span className="flex flex-row items-center">
                <Image src={cryptocat} width={25} height={25} />
                <p className="ml-2">{debtor.avatarURL}</p>
              </span>
              <p>
                {debtor.amount} {expenseData.token}
              </p>
              <p>
                {debtor.amount} {debtor.token}
              </p>
              <p>{debtor.paidOn}</p>
              <p>
                <button className="bg-btn-gradient font-bold px-3 py-2 rounded-2xl">
                  {debtor.paidOn ? "Paid" : "Unpaid"}
                </button>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default View;
