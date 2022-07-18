import type { NextPage } from "next";
import Link from "next/link";
import Preview from "../components/preview";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Expense from "../models/expense";
import plusIcon from "../public/plus-icon.svg";
import Image from "next/image";
import RequireAuth from "../components/require-auth";
import axios from "axios";

type DashboardData = Expense[];

const Dashboard: NextPage = () => {
  const { address } = useAccount();
  const [dashboardData, setDashboardData] = useState<DashboardData>([]);

  useEffect(() => {
    if (!address) return;

    setDashboardData([
      {
        name: "Apartment rent",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam at tortor non imperdiet turpis volutpat neque, mattis...",
        category: "misc",
        token: "USDT",
        paymentDue: 20220414,
        status: "pending",
        amount: 0,
        createdOn: 20220301,
        recipient: {
          name: "",
        },
        debtors: [
          {
            address: "0x1293081983192",
            name: "crypto-cat.eth",
            avatarURL: "",
            amount: 1000,
            token: "ETH",
            paidOn: 20220410,
          },
          {
            address: "0x9319084989",
            name: "crypto-cat.eth",
            avatarURL: "",
            amount: 1000,
            token: "ETH",
            paidOn: 20220410,
          },
        ],
      },
    ]);

    /*
    axios.get("").then((result) => {
      return;
    });*/
  }, []);

  return (
    <RequireAuth>
      <div className="h-screen bg-body-gradient pb-20">
        <div className="container mx-auto">
          <p className="pt-16 pb-8 text-primary text-3xl font-sans font-bold">
            Your Expenses
          </p>
          <div className="grid grid-cols-4 gap-4">
            {dashboardData.map((preview, i) => (
              <Link href="/expense/view" passHref key={i}>
                <a>
                  <Preview
                    name={preview.name}
                    description={preview.description}
                    category={preview.category}
                    token={preview.token}
                    paymentDue={preview.paymentDue}
                    status={preview.status}
                    recipient={preview.recipient}
                    debtors={preview.debtors}
                    createdOn={preview.createdOn}
                    amount={preview.amount}
                  />
                </a>
              </Link>
            ))}

            <Link href="/expense/create-expense-form">
              <div
                id="create-expense"
                className="h-full w-full rounded-lg flex flex-col justify-center items-center bg-secondary cursor-pointer"
              >
                <Image src={plusIcon} width={65} height={65} />
                <p className="text-primary ">Create Expense</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
};

export default Dashboard;
