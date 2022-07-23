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

const Preview: NextPage<{ expense: ExpenseModel }> = (props) => {
  const { expense } = props;

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

  function truncate(str: string, n: number) {
    return (str.length > n) ? str.substring(0, n - 1) + '...' : str;
  };

  function formatTimeType(value: number, type: string): string {
    if (value == 0) return '';
    if (Math.abs(value) == 1) return `  • ${Math.abs(value)} ${type}`;
    return `${Math.abs(value)} ${type}s`;
  }

  function calculateTimeDiff(expenseDue: Date): string {
    const currentTime = new Date();
    if (expenseDue.getTime() < currentTime.getTime()) return 'now';
    const timeDiff = expenseDue.getTime() - currentTime.getTime();
    let time = timeDiff;
    const days = Math.ceil(time / (1000 * 3600 * 24));
    const hours = Math.ceil(time / 1000 / 60 / 60);
    time -= hours * 1000 * 60 * 60;
    const minutes = Math.ceil(time / 1000 / 60);
    time -= minutes * 1000 * 60;
    const seconds = Math.ceil(time / 1000);
    time -= seconds * 1000;
    if (days != 0) return `${formatTimeType(days, 'day')}`;
    if (hours != 0) return `${formatTimeType(hours, 'hour')}`;
    if (minutes != 0) return `${formatTimeType(minutes, 'minute')}`;
    if (seconds != 0) return `${formatTimeType(seconds, 'second')}`;
    return 'now';
  }

  console.log(expense);

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
              <p className="ml-2 text-primary text-sm">{truncate(expense.creator, 15)}</p>
            </div>

            <button className="bg-btn-gradient text-primary py-2 px-3 rounded-3xl text-sm font-bold">
              {expense.status ? "Paid" : "Pending"}
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
              <p className="ml-2 text-xs">{truncate(expense.recipient, 10)}</p>
            </div>

            <div className="flex flex-row ml-3">
              <Image src={coinsIconSm} height={16} width={16} />
              <p className="ml-2 text-xs">{expense.amount - expense.amountPaid} {expense.token}</p>
            </div>

            <div className="flex flex-row ml-3">
              <Image src={calendarIcon} height={16} width={16} />
              <p className="ml-2 text-xs">{calculateTimeDiff(expense.paymentDue)}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Preview;
