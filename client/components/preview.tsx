import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import cryptocat from "../public/cryptocat.png";
import houseIcon from "../public/house-icon.svg";
import coinsIcon from "../public/coins-icon.svg";
import carIcon from "../public/car-icon.svg";
import foodIcon from "../public/food-icon.svg";
import profileIcon from "../public/profile-icon.svg";
import coinsIconSm from "../public/coins-icon-2.svg";
import calendarIcon from "../public/calendar-icon.svg";
import { ExpenseModel } from "../services/mocks/expenses";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

const Preview: NextPage<{ expense: ExpenseModel }> = (props) => {
  const { address } = useAccount();
  const { expense } = props;

  const [status, setStatus] = useState("Paid");
  for (let debtor of expense.debtors) {
    if (address == debtor.address) {
      setStatus(debtor.status);
    }
  }

  const [bgColor, setBgColor] = useState("bg-misc-gradient");
  const [bgIcon, setBgIcon] = useState(coinsIcon);

  useEffect(() => {
    switch (expense.category as any) {
      case "Accommodation":
        setBgColor("bg-accommodation-gradient");
        setBgIcon(houseIcon);
        break;
      case "Transportation":
        setBgColor("bg-transportation-gradient");
        setBgIcon(carIcon);
        break;
      case "Food and Drinks":
        setBgColor("bg-foodanddrinks-gradient");
        setBgIcon(foodIcon);
        break;
      case "Misc":
        setBgColor("bg-misc-gradient");
        setBgIcon(coinsIcon);
        break;
      default:
        break;
    }
  });

  return (
    <Link href="/expense/view">
      <div className="w-full h-full cursor-pointer">
        <div
          className={`rounded-lg rounded-b-none flex justify-center items-center h-48 ${bgColor}`}
        >
          <Image src={bgIcon} className="bg-white" width={100} height={100} />
        </div>

        <div className="bg-secondary p-3 rounded-lg rounded-t-none">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center">
              <Image src={cryptocat} width={24} height={24} />
              <p className="ml-2 text-primary text-sm">{expense.user}</p>
            </div>

            <button
              className={`text-primary py-2 px-3 rounded-3xl text-sm font-bold ${
                status ? "bg-paid-btn-gradient" : "bg-unpaid-btn-gradient"
              }`}
            >
              {status}
            </button>
          </div>

          <p className="font-sans text-primary text-lg font-bold mt-1">
            {expense.category}
          </p>
          <p className="text-secondary font-normal mt-2 text-sm">
            {expense.description}
          </p>

          <div className="flex flex-row border-t-2 border-tertiary mt-4 pt-5 text-primary">
            <div className="flex flex-row">
              <Image src={profileIcon} height={16} width={16} />
              <p className="ml-2 text-xs">{expense.recipientAddress}</p>
            </div>

            <div className="flex flex-row ml-3">
              <Image src={coinsIconSm} height={16} width={16} />
              <p className="ml-2 text-xs">{expense.remaining}</p>
            </div>

            <div className="flex flex-row ml-3">
              <Image src={calendarIcon} height={16} width={16} />
              <p className="ml-2 text-xs">{expense.timeRemaining}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Preview;
