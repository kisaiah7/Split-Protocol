import type { NextPage } from "next";
import Image from "next/image";
import cryptocat from "../../public/cryptocat.png";
import houseIcon from "../../public/house-icon.svg";
import coinsIcon from "../../public/coins-icon.svg";
import carIcon from "../../public/car-icon.svg";
import foodIcon from "../../public/food-icon.svg";
import { useState } from "react";
import AsyncState from "../../models/async-state";
import expenseService, { ExpenseModel } from "../../services/mocks/expenses";
import { useEffectOnce } from "../../hooks/use-effect-once";
import { useEffect } from "react";
import { toast } from "react-toastify";
import Loader from "../../components/loader";
import Pay from "../../components/pay";
import { useAccount } from "wagmi";

const View: NextPage = () => {
  const { address } = useAccount();
  const [state, setState] = useState<AsyncState<ExpenseModel>>({
    data: undefined,
    loading: true,
    error: undefined,
  });

  const [bgColor, setBgColor] = useState("bg-misc-gradient");
  const [bgIcon, setBgIcon] = useState(coinsIcon);
  const [viewPayForm, togglePayForm] = useState(false);

  useEffectOnce(() => {
    if (!address) throw new Error("No active wallet connection");
    setState({ data: undefined, loading: true, error: undefined });
    const fetchData = async () => {
      try {
        const res = await expenseService.loadExpense(1);
        if (loading == true) {
          setState({ data: res, loading: false, error: false });
          toast.success("Loaded expense");
        }
      } catch (error) {
        setState({ data: undefined, loading: false, error });
        toast.error("Error while loading expenses");
      }
    };
    fetchData();
  });

  const formatDateYMD = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const toggleViewPayForm = () => {
    togglePayForm((prevState) => !prevState);
  };

  function truncate(str: string, n: number) {
    return str.length > n ? str.substring(0, n - 1) + "..." : str;
  }

  function formatTimeType(value: number, type: string): string {
    if (value == 0) return "";
    if (Math.abs(value) == 1) return `  • ${Math.abs(value)} ${type}`;
    return `${Math.abs(value)} ${type}s`;
  }

  function calculateTimeDiff(expenseDue: Date): string {
    const currentTime = new Date();
    if (expenseDue.getTime() < currentTime.getTime()) return "now";
    const timeDiff = expenseDue.getTime() - currentTime.getTime();
    let time = timeDiff;
    const days = Math.ceil(time / (1000 * 3600 * 24));
    const hours = Math.ceil(time / 1000 / 60 / 60);
    time -= hours * 1000 * 60 * 60;
    const minutes = Math.ceil(time / 1000 / 60);
    time -= minutes * 1000 * 60;
    const seconds = Math.ceil(time / 1000);
    time -= seconds * 1000;
    if (days != 0) return `${formatTimeType(days, "day")}`;
    if (hours != 0) return `${formatTimeType(hours, "hour")}`;
    if (minutes != 0) return `${formatTimeType(minutes, "minute")}`;
    if (seconds != 0) return `${formatTimeType(seconds, "second")}`;
    return "now";
  }

  const { data: expense, loading, error } = state;

  useEffect(() => {
    if (state.data) {
      switch (state.data.category as any) {
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
    }
  });

  return (
    <div className="h-screen bg-body-gradient flex flex-col items-center justify-center">
      {!loading && expense ? (
        <>
          {viewPayForm ? <Pay toggleViewPayForm={toggleViewPayForm} /> : ""}
          <div className="container flex flex-row items-end">
            <div
              className={`rounded-lg w-96 h-64 flex items-center justify-center ${bgColor}`}
            >
              <Image
                src={bgIcon}
                className="bg-white"
                width={100}
                height={100}
              />
            </div>

            <div className="flex flex-col ml-7">
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center">
                  <Image src={cryptocat} width={24} height={24} />
                  <p className="ml-2 text-primary text-sm">{expense.creator}</p>
                </div>

                <button className="bg-btn-gradient text-primary py-2 px-3 rounded-3xl text-sm font-bold">
                  {expense.status}
                </button>
              </div>

              <p className="font-sans text-primary text-4xl font-bold mt-1">
                {expense.name}
              </p>

              <div className="flex flex-row mb-2 mt-5 text-primary">
                <div className="text-center">
                  <p className="text-muted font-bold text-2xs tracking-widest">
                    CREATED
                  </p>
                  <p className="text-sm mt-1">
                    {formatDateYMD(expense.createdAt)}
                  </p>
                </div>

                <div className="text-center ml-3">
                  <p className="text-muted font-bold text-2xs tracking-widest">
                    RECIPIENT
                  </p>
                  <p className="text-sm mt-1">
                    {truncate(expense.recipient, 10)}
                  </p>
                </div>

                <div className="text-center ml-3">
                  <p className="text-muted font-bold text-2xs tracking-widest">
                    TOTAL
                  </p>
                  <p className="text-sm mt-1">{expense.amount}</p>
                </div>

                <div className="text-center ml-3">
                  <p className="text-muted font-bold text-2xs tracking-widest">
                    REMAINING
                  </p>
                  <p className="text-sm mt-1">
                    {expense.amount - expense.amountPaid}
                  </p>
                </div>

                <div className="text-center ml-3">
                  <p className="text-muted font-bold text-2xs tracking-widest">
                    TIME REMAINING
                  </p>
                  <p className="text-sm mt-1">
                    {calculateTimeDiff(expense.paymentDue)}
                  </p>
                </div>
              </div>

              <p className="text-secondary font-normal mt-2 text-xs tracking-wide">
                {expense.description}
              </p>

              <button className="mt-4 flex flex-row items-center text-primary w-fit bg-btn-gradient rounded-md px-3 py-2">
                <Image
                  className="text-primary"
                  src={coinsIcon}
                  width={24}
                  height={24}
                />
                <a className="ml-2" onClick={() => toggleViewPayForm()}>
                  Pay Share
                </a>
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
              {expense.debtors.map((debtor, index) => {
                return (
                  <div
                    key={index}
                    className="py-5 border-b-2 border-tertiary flex flex-row items-center text-primary text-xs tracking-wide grid grid-cols-5"
                  >
                    <span className="flex flex-row items-center">
                      <Image src={cryptocat} width={25} height={25} />
                      <p className="ml-2">{debtor.address}</p>
                    </span>
                    <p>{debtor.amount}</p>
                    <p>{debtor.amountOut ? debtor.amountOut : "N/A"}</p>
                    <p>{formatDateYMD(debtor.paidAt)}</p>
                    <p>
                      <button
                        className={`font-bold px-3 py-2 rounded-2xl ${
                          debtor.hasPaid
                            ? "bg-paid-btn-gradient"
                            : "bg-unpaid-btn-gradient"
                        }`}
                      >
                        {debtor.hasPaid ? "Paid" : "Unpaid"}
                      </button>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default View;
