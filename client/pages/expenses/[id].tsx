import type { NextPage } from 'next';
import Image from 'next/image';
import houseIcon from '../../public/house-icon.svg';
import coinsIcon from '../../public/coins-icon.svg';
// @ts-ignore
import CoinsIcon from '../../public/coins-icon.svg?inline';
import carIcon from '../../public/car-icon.svg';
import foodIcon from '../../public/food-icon.svg';
import { useState } from 'react';
import AsyncState from '../../models/async-state';
import expenseService, { ExpenseModel } from '../../services/expenses';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import Loader from '../../components/loader';
import Pay from '../../components/pay';
import { useAccount, useContract, useProvider } from 'wagmi';
import { useRouter } from 'next/router';
import splitContractArtifact from '../../utils/abis/Split.json';
import { Blockie } from '../../components/profile-image';
import { truncate } from '../../utils/truncate';
import { calculateTimeDiff } from '../../utils/time';
import RequireAuth from '../../components/require-auth';
import DarkOverlay from '../../components/dark-overlay';
import Button from '../../components/button';

const ExpenseDetail: NextPage = () => {
  if (!process.env.NEXT_PUBLIC_SPLIT_CONTRACT_ADDRESS)
    throw new Error(
      'Environment variable NEXT_PUBLIC_SPLIT_CONTRACT_ADDRESS is undefined'
    );

  const { address } = useAccount();
  const [state, setState] = useState<AsyncState<ExpenseModel>>({
    data: undefined,
    loading: true,
    error: undefined,
  });
  const [expenseIndex, setExpenseIndex] = useState<number | null>();

  const [bgColor, setBgColor] = useState('bg-misc-gradient');
  const [bgIcon, setBgIcon] = useState(coinsIcon);
  const [viewPayForm, togglePayForm] = useState(false);

  const router = useRouter();

  const provider = useProvider();
  const contract = useContract({
    addressOrName: process.env.NEXT_PUBLIC_SPLIT_CONTRACT_ADDRESS,
    contractInterface: splitContractArtifact.abi,
    signerOrProvider: provider,
  });

  useEffect(() => {
    if (!address || !router.isReady) return;
    fetchData(address);
  }, [router.isReady]);

  const fetchData = async (address: string) => {
    try {
      const { id: expenseIndex } = router.query;
      if (typeof expenseIndex !== 'string' || expenseIndex === '')
        throw new Error('Invalid path');
      setExpenseIndex(parseInt(expenseIndex));
      const res = await expenseService.loadExpense(
        contract,
        address,
        parseInt(expenseIndex)
      );
      setState({ data: res, loading: false, error: false });
    } catch (error) {
      setState({ data: undefined, loading: false, error });
      toast.error('Error while loading expenses');
    }
  };

  const formatDateYMD = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const toggleViewPayForm = () => {
    togglePayForm((prevState) => !prevState);
  };

  const { data: expense, loading } = state;

  useEffect(() => {
    if (!address) return;
    if (state.data) {
      switch (state.data.category as any) {
        case 'Accommodation':
          setBgColor('bg-accommodation-gradient');
          setBgIcon(houseIcon);
          break;
        case 'Transportation':
          setBgColor('bg-transportation-gradient');
          setBgIcon(carIcon);
          break;
        case 'Food and Drinks':
          setBgColor('bg-foodanddrinks-gradient');
          setBgIcon(foodIcon);
          break;
        case 'Misc':
          setBgColor('bg-misc-gradient');
          setBgIcon(coinsIcon);
          break;
        default:
          break;
      }
    }
  }, [state.data]);

  const expensePaidByAddress = expense
    ? expense.debtors.find((debtor) => {
        if (debtor.address == address && debtor.hasPaid) return true;
      })
    : false;

  return (
    <RequireAuth>
      <div className="h-screen bg-body-gradient flex flex-col items-center justify-center">
        {expense && (
          <>
            {viewPayForm &&
              expenseIndex !== null &&
              expenseIndex !== undefined && (
                <DarkOverlay>
                  <div className="container mx-auto">
                    <div className="max-w-5xl mx-auto">
                      <Pay
                        recipientToken={expense.token}
                        shareAmountInRecipientToken={
                          expense.debtors.find(
                            (debtor: any) => debtor.address === address
                          )?.amount ?? 0
                        }
                        expenseIndex={expenseIndex}
                        toggleViewPayForm={toggleViewPayForm}
                      />
                    </div>
                  </div>
                </DarkOverlay>
              )}
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
                <div className="flex flex-row items-center">
                  <Blockie address={expense.creator} />
                  <p className="ml-2 text-primary text-sm">{expense.creator}</p>
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
                    <p title={expense.recipient} className="text-sm mt-1">
                      {truncate(expense.recipient, 10)}{' '}
                    </p>
                  </div>

                  <div className="text-center ml-3">
                    <p className="text-muted font-bold text-2xs tracking-widest">
                      TOTAL
                    </p>
                    <p className="text-sm mt-1">
                      {expense.amount} {expense.token}
                    </p>
                  </div>

                  <div className="text-center ml-3">
                    <p className="text-muted font-bold text-2xs tracking-widest">
                      REMAINING
                    </p>
                    <p className="text-sm mt-1">
                      {expense.amount -
                        expense.debtors
                          .filter((debtor) => debtor.hasPaid)
                          .map((debtor) => debtor.amount)
                          .reduce(
                            (previousValue, currentvalue) =>
                              previousValue + currentvalue,
                            0
                          )}{' '}
                      {expense.token}
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
                  <div className="text-center ml-3">
                    <p className="text-muted font-bold text-2xs tracking-widest">
                      STATUS
                    </p>
                    <p className="text-sm mt-1">{expense.status}</p>
                  </div>
                </div>

                <p className="text-secondary font-normal mt-2 text-xs tracking-wide">
                  {expense.description}
                </p>

                {!expensePaidByAddress && (
                  <>
                    {process.env.NODE_ENV !== 'production' ? (
                      <div className="flex">
                        <Button
                          Icon={CoinsIcon}
                          label="Pay split"
                          className="mt-4"
                          onClick={toggleViewPayForm}
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-start gap-2">
                        <Button
                          Icon={CoinsIcon}
                          label="Pay split"
                          className="mt-4"
                          isDisabled={true}
                        />
                        <p className="text-left font-sans text-muted">
                          The pay share functionality is not available yet on
                          Polygon Mumbai
                        </p>
                      </div>
                    )}
                  </>
                )}
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
                        <Blockie address={debtor.address} />
                        <p title={debtor.address} className="ml-2">
                          {truncate(debtor.address, 10)}{' '}
                        </p>
                      </span>
                      <p>
                        {debtor.amount} {expense.token}
                      </p>
                      <p>
                        {debtor.hasPaid
                          ? `${debtor.amount} ${expense.token}`
                          : 'N/A'}
                      </p>
                      <p>
                        {debtor.hasPaid ? formatDateYMD(debtor.paidAt) : 'N/A'}
                      </p>
                      <p>
                        <button
                          className={`font-bold px-3 py-2 rounded-2xl ${
                            debtor.hasPaid
                              ? 'bg-paid-btn-gradient'
                              : 'bg-unpaid-btn-gradient'
                          }`}
                        >
                          {debtor.hasPaid ? 'Paid' : 'Unpaid'}
                        </button>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
      {loading && (
        <DarkOverlay>
          <Loader />
        </DarkOverlay>
      )}
    </RequireAuth>
  );
};

export default ExpenseDetail;
