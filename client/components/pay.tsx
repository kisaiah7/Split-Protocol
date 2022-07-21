import Image from "next/image";
import FormGroup from "../components/form-group";
import Input from "../components/input";
import Select from "../components/select";
import infoIcon from "../public/info-icon.svg";
import cancelIcon from "../public/close-icon.svg";
import checkIcon from "../public/check-icon.svg";
import { toast } from "react-toastify";
import Router from "next/router";
import expenseService from "../services/mocks/expenses";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";

export type PayFormData = {
  token: string;
  shareAmount: number;
  recipientToken: string;
  receipientAmount: number;
  networkFee: string;
  swapFee: string;
  totalFee: string;
};

type Props = {
  toggleViewPayForm: () => void;
};

const Pay = ({ toggleViewPayForm }: Props) => {
  const [PayformData, setPayFormData] = useState<PayFormData>({
    token: "eth",
    shareAmount: 0,
    recipientToken: "usdt",
    receipientAmount: 0,
    networkFee: "0.00000001 ETH",
    swapFee: "0.000001 ETH",
    totalFee: "1.00000101 ETH",
  });

  const onChange = ({
    target: { name, value },
  }: ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >) => {
    setPayFormData({
      ...PayformData,
      [name]:
        name === "amount" || name === "paymentDue"
          ? value
            ? parseInt(value)
            : 0
          : value,
    });
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // TODO backend call
    const res = await expenseService.payExpense(PayformData);
    if (res < 0) {
      toast.error("Error processing payment");
    } else {
      toast.success("New payment made. Redirecting...");
    }
    Router.push(`/expense/view`);
    toggleViewPayForm();
    console.log(PayformData);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="absolute z-20 bg-secondary px-10 py-8 sm:container mx-auto rounded-lg"
    >
      <div className="grid grid-cols-2 w-full gap-3">
        <FormGroup
          label="Token"
          formControl={
            <Select
              name="token"
              placeholder="Choose..."
              options={["usdt", "eth"]}
              value={PayformData.token}
              onChange={onChange}
            />
          }
        />
        <FormGroup
          label="Share amount (in selected token)"
          formControl={
            <Input
              name="shareAmount"
              value={PayformData.shareAmount.toString()}
              placeholder="0"
              type="number"
              onChange={onChange}
            />
          }
        />

        <FormGroup
          label="Recipient token"
          formControl={
            <Select
              name="recipientToken"
              placeholder="Choose..."
              options={["usdt", "eth"]}
              value={PayformData.recipientToken}
              onChange={onChange}
            />
          }
        />
        <FormGroup
          label="Share amount (in recipient token)"
          formControl={
            <Input
              name="recipientAmount"
              value={PayformData.receipientAmount.toString()}
              placeholder="0"
              type="number"
              onChange={onChange}
            />
          }
        />
      </div>

      <span className="mt-2 text-muted text-2xs flex items-center">
        <Image src={infoIcon} width={10} height={10} />
        <p className="ml-1">1 USDT = 0.001 ETH</p>
      </span>

      <div className="border-b-2 pb-3 border-tertiary mt-5 grid grid-cols-2 w-full gap-x-3 text-secondary text-sm">
        <p>Share (in selected token): </p>
        <p className="text-right">
          {PayformData.shareAmount} {PayformData.token}
        </p>
        <p>Network fee: </p>
        <p className="text-right">{PayformData.networkFee}</p>
        <p>Swap fee: </p>
        <p className="text-right">{PayformData.swapFee}</p>
        <span className="col-span-2 mt-2 flex justify-end text-muted text-xs flex items-center">
          <Image src={infoIcon} width={10} height={10} />
          <p className="ml-1">
            Your selected token diverges from jon-doe.eth's accepted token. In
            order to swap {PayformData.token} to {PayformData.recipientToken} a
            small fee has to be provided.
          </p>
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 w-full gap-3 text-primary text-sm">
        <p>Total</p>
        <p className="text-right">{PayformData.totalFee}</p>
      </div>

      <div className="text-primary flex justify-end mt-7">
        <button
          onClick={() => toggleViewPayForm()}
          className="flex items-center bg-cancel-gradient tracking-widest px-2 py-1 text-sm rounded-sm"
        >
          <Image width={16} height={16} src={cancelIcon} />{" "}
          <a className="ml-2">Cancel</a>
        </button>
        <button className="ml-3 flex items-center bg-btn-gradient tracking-widest px-2 py-1 text-sm rounded-sm">
          <Image width={16} height={16} src={checkIcon} />{" "}
          <a className="ml-2">Confirm</a>
        </button>
      </div>
    </form>
  );
};

export default Pay;
