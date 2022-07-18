import Image from "next/image";
// @ts-ignore
import cryptocat from "../public/cryptocat.png";
// @ts-ignore
import houseIcon from "../public/house-icon.svg";
// @ts-ignore
import foodIcon from "../public/food-icon.svg";
// @ts-ignore
import carIcon from "../public/car-icon.svg";
// @ts-ignore
import coinsIcon from "../public/coins-icon.svg";
// @ts-ignore
import profileIcon from "../public/profile-icon.svg";
// @ts-ignore
import smCoinsIcon from "../public/coins-icon-2.svg";
// @ts-ignore
import calendarIcon from "../public/calendar-icon.svg";
import Expense from "../models/expense";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

type Props = Expense;

const Preview = ({
  name,
  description,
  category,
  token,
  paymentDue,
  status,
  recipient,
  debtors,
}: Props) => {
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

  useEffect(() => {
    // To calculate the Time Remaining
    const paymentDueDate = new Date(paymentDue);
    const todaysDate = new Date();
    // To calculate the time difference of two dates
    const timeRemaining = paymentDueDate.getTime() - todaysDate.getTime();
    // To calculate the no. of days between two dates
    setDaysRemaining(timeRemaining / (1000 * 3600 * 24));

    // Set the image/bg color depending on category
    // TODO fix case
    switch (category as any) {
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

    for (let debtor of debtors) {
      if (debtor.address == address) {
        setDebtorData(debtor);
      }
    }
  });

  // TODO dynamically import profile picture
  return (
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
            <p className="ml-2 text-primary text-sm">{debtorData.name}</p>
          </div>

          <button className="bg-btn-gradient text-primary py-2 px-3 rounded-3xl text-sm font-bold">
            {status}
          </button>
        </div>

        <p className="font-sans text-primary text-lg font-bold mt-1">{name}</p>
        <p className="text-secondary font-normal mt-2 text-sm max-w-full text-ellipsis max-h-28">
          {description}
        </p>

        <div className="flex flex-row border-t-2 border-tertiary mt-4 pt-5 text-primary flex-wrap">
          <div className="flex flex-row mr-3">
            <Image src={profileIcon} height={16} width={16} />
            <p className="ml-2 text-xs">{recipient.name}</p>
          </div>

          <div className="flex flex-row mr-3">
            <Image src={smCoinsIcon} height={16} width={16} />
            <p className="ml-2 text-xs">
              {debtorData.amount} {token}
            </p>
          </div>

          <div className="flex flex-row">
            <Image src={calendarIcon} height={16} width={16} />
            <p className="ml-2 text-xs">{daysRemaining} days</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
