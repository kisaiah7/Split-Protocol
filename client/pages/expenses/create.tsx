import type { NextPage } from 'next';
// @ts-ignore
import PlusIcon from '../../public/plus-icon.svg?inline';
// @ts-ignore
import CheckIcon from '../../public/check-icon.svg?inline';
import RequireAuth from '../../components/require-auth';
import FormGroup from '../../components/form-group';
import Input from '../../components/input';
import Select from '../../components/select';
import DebtorListItem from '../../components/debtor-list-item';
import Debtor from '../../models/debtor';
import TextArea from '../../components/text-area';
import Button from '../../components/button';
import Heading from '../../components/heading';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useAccount, useContract, useSigner } from 'wagmi';
import splitContract from '../../utils/abis/Split.json';
import expenseService from '../../services/expenses';
import Router from 'next/router';
import { toast } from 'react-toastify';
import Loader from '../../components/loader';
import { TokenSymbol } from '../../enums/TokenSymbol';
import DarkOverlay from '../../components/dark-overlay';

export enum ExpenseCategory {
  ACCOMODATION = 'accomodation',
  TRANSPORTATION = 'transportation',
  FOOD = 'food',
  MISC = 'misc',
}

export interface FormData {
  name: string;
  description: string;
  category: ExpenseCategory | '';
  token: TokenSymbol | '';
  amount: number;
  paymentDue: number;
  recipientAddress: string;
  debtors: Debtor[];
}

const Expense: NextPage = () => {
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const { address } = useAccount();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    category: '',
    token: '',
    amount: 0,
    paymentDue: 0,
    recipientAddress: '',
    debtors: [
      {
        address: address ?? '',
        amount: 0,
      },
    ],
  });
  const { data: signer } = useSigner();
  const contract = useContract({
    addressOrName: process.env.NEXT_PUBLIC_SPLIT_CONTRACT_ADDRESS!,
    contractInterface: splitContract.abi,
    signerOrProvider: signer,
  });

  useEffect(() => {
    if (!address) return;
    setFormData({
      ...formData,
      debtors: formData.debtors.map((debtor, index) =>
        index === 0 ? { ...debtor, address } : debtor
      ),
    });
  }, []);

  const addDebtor = () => {
    setFormData({
      ...formData,
      debtors: [
        ...formData.debtors,
        {
          address: '',
          amount: 0,
        },
      ],
    });
  };

  const removeDebtor = (index: number) => {
    setFormData({
      ...formData,
      debtors: formData.debtors.filter((_, i) => index !== i),
    });
  };

  const onChange = ({
    target: { name, value },
  }: ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >) => {
    setFormData({
      ...formData,
      [name]:
        name === 'amount' || name === 'paymentDue'
          ? value
            ? parseInt(value)
            : 0
          : value,
    });
  };

  const onChangeDebtor = (index: number, changedDebtor: Debtor) => {
    setFormData({
      ...formData,
      debtors: formData.debtors.map((debtor, i) =>
        index === i ? changedDebtor : debtor
      ),
    });
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      if (!address) throw new Error('No active wallet connection');

      setSubmitLoading(true);

      const latestExpenseIndex = await expenseService.getLatestExpenseIndex(
        contract,
        address
      );
      const res = await expenseService.createExpense(
        address,
        contract,
        formData
      );
      if (res < 0) {
        toast.error('Error creating expense');
      } else {
        toast.success('New expense created');
      }
      Router.push(`/expenses/${latestExpenseIndex + 1}`);
      setSubmitLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <RequireAuth>
      <div className="h-full bg-body-gradient pb-20 flex">
        <div className="container mx-auto mt-16">
          <Heading type="secondary">Create a shared expense</Heading>
          <form
            className="rounded-md bg-secondary p-16 mt-8 flex flex-col gap-8"
            onSubmit={onSubmit}
          >
            <div className="grid grid-cols-2 gap-4">
              <FormGroup
                label="Name"
                className="col-span-2"
                formControl={
                  <Input
                    name="name"
                    value={formData.name}
                    placeholder="Holiday villa"
                    onChange={onChange}
                  />
                }
              />
              <FormGroup
                label="Recipient"
                className="col-span-2"
                formControl={
                  <Input
                    name="recipientAddress"
                    value={formData.recipientAddress}
                    placeholder="villas-on-mallorca.eth"
                    onChange={onChange}
                  />
                }
              />
              <FormGroup
                label="Recipient token"
                formControl={
                  <Select
                    name="token"
                    placeholder="Choose..."
                    options={Object.values(TokenSymbol)}
                    value={formData.token}
                    onChange={onChange}
                  />
                }
              />
              <FormGroup
                label="Total amount"
                formControl={
                  <Input
                    name="amount"
                    value={formData.amount.toString()}
                    placeholder="4000"
                    type="number"
                    onChange={onChange}
                  />
                }
              />
              <FormGroup
                label="Category"
                className="col-span-2"
                formControl={
                  <Select
                    name="category"
                    placeholder="Choose..."
                    options={Object.values(ExpenseCategory)}
                    value={formData.category}
                    onChange={onChange}
                  />
                }
              />
              <FormGroup
                label="Description"
                className="col-span-2"
                formControl={
                  <TextArea
                    name="description"
                    value={formData.description}
                    placeholder="Lorem ipsum dolor sit amet..."
                    onChange={onChange}
                  />
                }
              />
            </div>
            <div>
              <Heading type="tertiary">Debtors</Heading>
              <ul className="flex flex-col gap-4 mt-4">
                {formData.debtors.map((debtor, index) => (
                  <DebtorListItem
                    key={index}
                    debtor={debtor}
                    isRemovable={index !== 0}
                    onClickRemoveButton={() => removeDebtor(index)}
                    onChange={(changedDebtor) =>
                      onChangeDebtor(index, changedDebtor)
                    }
                  />
                ))}
              </ul>
              <Button
                Icon={PlusIcon}
                label="Add debtor"
                theme="condensed"
                className="mt-4"
                onClick={addDebtor}
              />
            </div>
            <FormGroup
              label="Payment due"
              formControl={
                <Input
                  name="paymentDue"
                  value={formData.paymentDue.toString()}
                  placeholder="2022-07-15"
                  type="number"
                  onChange={onChange}
                />
              }
            />
            <div className="flex justify-end">
              <Button label="Confirm" Icon={CheckIcon} type="submit" />
            </div>
          </form>
        </div>
        {submitLoading && (
          <DarkOverlay>
            <Loader />
          </DarkOverlay>
        )}
      </div>
    </RequireAuth>
  );
};

export default Expense;
