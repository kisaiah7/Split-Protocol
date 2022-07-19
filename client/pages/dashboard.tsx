import { useState } from "react";
import type { NextPage } from "next";
import Preview from "../components/preview";
import Loader from "../components/loader";
import expenseService, { ExpenseModel } from "../services/mocks/expenses";
import AsyncState from "../models/async-state";
import { toast } from "react-toastify";
import { useEffectOnce } from "../hooks/use-effect-once";

const Dashboard: NextPage = () => {
  const [state, setState] = useState<AsyncState<ExpenseModel[]>>({
    data: undefined,
    loading: true,
    error: undefined,
  });

  useEffectOnce(() => {
    setState({ data: undefined, loading: true, error: undefined });
    const fetchData = async () => {
      try {
        const res = await expenseService.loadExpensesPreviews();
        if (loading == true) {
          setState({ data: res, loading: false, error: false });
          toast.success("Loaded expenses");
        }
      } catch (error) {
        setState({ data: undefined, loading: false, error });
        toast.error("Error while loading expenses");
      }
    };
    fetchData();
  });

  const { data, loading, error } = state;
  return (
    <div className="h-full bg-body-gradient pb-20">
      <div className="container mx-auto">
        <p className="pt-16 pb-8 text-primary text-3xl font-sans font-bold">
          Your Expenses
        </p>
        {loading ? (
          <div style={{ minHeight: "70vh" }}>
            <Loader />
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {data?.map((expense, index) => {
              return <Preview key={index} expense={expense}></Preview>;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
