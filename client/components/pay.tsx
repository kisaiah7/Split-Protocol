import Image from 'next/image';
import FormGroup from '../components/form-group';
import Input from '../components/input';
import Select from '../components/select';
import infoIcon from '../public/info-icon.svg';
import cancelIcon from '../public/close-icon.svg';
import checkIcon from '../public/check-icon.svg';
import { toast } from 'react-toastify';
import Router from 'next/router';
import expenseService from '../services/mocks/expenses';
import { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { TokenSymbol } from '../enums/TokenSymbol';
import useSwap from '../hooks/use-swap';

export type PayFormData = {
  token: TokenSymbol | '';
  shareAmount: number;
  recipientToken: TokenSymbol;
  shareAmountInRecipientToken: number;
  networkFee: string;
  swapFee: string;
  totalFee: string;
};

type Props = {
  toggleViewPayForm: () => void;
};

const Pay = ({ toggleViewPayForm }: Props) => {
  const [payFormData, setPayFormData] = useState<PayFormData>({
    token: '',
    shareAmount: 0,
    recipientToken: TokenSymbol.WETH,
    shareAmountInRecipientToken: 1,
    networkFee: '0.00000001 ETH',
    swapFee: '0.000001 ETH',
    totalFee: '1.00000101 ETH',
  });
  const {
    fromToken,
    toToken,
    pool,
    fromTokenPrice,
    toTokenPrice,
    changePool,
    getQuoteReverse,
  } = useSwap();

  const onChangeToken = async (event: ChangeEvent<HTMLSelectElement>) => {
    onChange(event);

    await changePool(event.target.value, payFormData.recipientToken);

    setTimeout(async () => {
      const amountIn = await getQuoteReverse(
        payFormData.shareAmountInRecipientToken
      );
      setPayFormData((payFormData) => ({
        ...payFormData,
        shareAmount: parseInt(amountIn),
      }));
    });
  };

  const onChange = ({
    target: { name, value },
  }: ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >) => {
    setPayFormData({
      ...payFormData,
      [name]:
        name === 'shareAmount' || name === 'shareAmountInRecipientToken'
          ? value
            ? parseInt(value)
            : 0
          : value,
    });
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // TODO backend call
    const res = await expenseService.payExpense(payFormData);
    if (res < 0) {
      toast.error('Error processing payment');
    } else {
      toast.success('New payment made. Redirecting...');
    }
    Router.push(`/expense/view`);
    toggleViewPayForm();
    console.log(payFormData);
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
              options={Object.values(TokenSymbol)}
              value={payFormData.token}
              onChange={onChangeToken}
            />
          }
        />
        <FormGroup
          label="Share amount (in selected token)"
          formControl={
            <Input
              name="shareAmount"
              value={payFormData.shareAmount.toString()}
              placeholder="1000"
              type="number"
              isDisabled={true}
              onChange={onChange}
            />
          }
        />

        <FormGroup
          label="Recipient token"
          formControl={
            <Input
              name="recipientToken"
              value={payFormData.recipientToken}
              placeholder={TokenSymbol.USDT}
              isDisabled={true}
              onChange={onChange}
            />
          }
        />
        <FormGroup
          label="Share amount (in recipient token)"
          formControl={
            <Input
              name="shareAmountInRecipientToken"
              value={payFormData.shareAmountInRecipientToken.toString()}
              placeholder="1000"
              type="number"
              isDisabled={true}
              onChange={onChange}
            />
          }
        />
      </div>
      {payFormData.token && toTokenPrice && (
        <span className="mt-2 text-muted text-2xs flex items-center">
          <Image src={infoIcon} width={10} height={10} />

          <p className="ml-1">
            1 {payFormData.token} = {fromTokenPrice}{' '}
            {payFormData.recipientToken}
          </p>
        </span>
      )}

      <div className="border-b-2 pb-3 border-tertiary mt-5 grid grid-cols-2 w-full gap-x-3 text-secondary text-sm">
        <p>Share (in selected token): </p>
        <p className="text-right">
          {payFormData.shareAmount} {payFormData.token}
        </p>
        <p>Network fee: </p>
        <p className="text-right">{payFormData.networkFee}</p>
        <p>Swap fee: </p>
        <p className="text-right">{payFormData.swapFee}</p>
        <span className="col-span-2 mt-2 flex justify-end text-muted text-xs flex items-center">
          <Image src={infoIcon} width={10} height={10} />
          <p className="ml-1">
            Your selected token diverges from jon-doe.eth's accepted token. In
            order to swap {payFormData.token} to {payFormData.recipientToken} a
            small fee has to be provided.
          </p>
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 w-full gap-3 text-primary text-sm">
        <p>Total</p>
        <p className="text-right">{payFormData.totalFee}</p>
      </div>

      <div className="text-primary flex justify-end mt-7">
        <button
          onClick={() => toggleViewPayForm()}
          type="button"
          className="flex items-center bg-cancel-gradient tracking-widest px-2 py-1 text-sm rounded-sm"
        >
          <Image width={16} height={16} src={cancelIcon} />{' '}
          <a className="ml-2">Cancel</a>
        </button>
        <button className="ml-3 flex items-center bg-btn-gradient tracking-widest px-2 py-1 text-sm rounded-sm">
          <Image width={16} height={16} src={checkIcon} />{' '}
          <a className="ml-2">Confirm</a>
        </button>
      </div>
    </form>
  );
};

export default Pay;
