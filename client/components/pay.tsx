import Image from 'next/image';
import FormGroup from '../components/form-group';
import Input from '../components/input';
import Select from '../components/select';
import infoIcon from '../public/info-icon.svg';
// @ts-ignore
import CancelIcon from '../public/close-icon.svg?inline';
// @ts-ignore
import CheckIcon from '../public/check-icon.svg?inline';
import { toast } from 'react-toastify';
import Router from 'next/router';
import expenseService from '../services/mocks/expenses';
import { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { TokenSymbol } from '../enums/TokenSymbol';
import useSwap from '../hooks/use-swap';
import {
  useAccount,
  useContract,
  useNetwork,
  useProvider,
  useSigner,
  erc20ABI,
} from 'wagmi';
import SplitContractArtifact from '../utils/abis/Split.json';
import { ethers } from 'ethers';
import WMATICABI from '../utils/abis/WMATIC.json';
import { LOCALHOST_CHAIN_ID } from '../pages/_app';
import Button from './button';

export type PayFormData = {
  token: TokenSymbol | '';
  shareAmount: number;
  recipientToken: TokenSymbol | '';
  shareAmountInRecipientToken: number;
  networkFee: number;
  swapFee: number;
};

type Props = {
  toggleViewPayForm: () => void;
};

const Pay = ({ toggleViewPayForm }: Props) => {
  const [payFormData, setPayFormData] = useState<PayFormData>({
    token: '',
    shareAmount: 0,
    recipientToken: '',
    shareAmountInRecipientToken: 0,
    networkFee: 0,
    swapFee: 0,
  });
  const {
    fromToken,
    pool,
    fromTokenPrice,
    toTokenPrice,
    changePool,
    getQuoteReverse,
  } = useSwap();
  const { data: signer } = useSigner();
  const provider = useProvider();
  const splitContract = useContract({
    addressOrName: process.env.NEXT_PUBLIC_SPLIT_CONTRACT_ADDRESS!,
    contractInterface: SplitContractArtifact.abi,
    signerOrProvider: signer,
  });
  const { address } = useAccount();
  const { chain } = useNetwork();

  useEffect(() => {
    populateView();
  }, []);

  const populateView = async () => {
    try {
      const { recipientToken, shareAmountInRecipientToken } = await fetchData();
      setPayFormData({
        ...payFormData,
        recipientToken,
        shareAmountInRecipientToken,
      });
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * This method is only necessary as long as the data for the view is not passed as props which it eventually will.
   * Once all data is correctly fetched the parent view is supposed to pass down the necessary data to this component and
   * no data fetching should be done in this component.
   * @returns Promise<void>
   */
  const fetchData = async () => {
    if (!process.env.NEXT_PUBLIC_SPLIT_CONTRACT_ADDRESS)
      throw new Error('NEXT_PUBLIC_SPLIT_CONTRACT_ADDRESS is undefined');
    const splitContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_SPLIT_CONTRACT_ADDRESS,
      SplitContractArtifact.abi,
      provider
    );
    console.log(splitContract);
    console.log(provider);
    console.log(address);
    const owedExpensesCount = await splitContract.getNumberOfOwedExpenses(
      address
    );
    console.log(`There are ${owedExpensesCount} expenses that are unpaid`);
    if (owedExpensesCount.toString() === '0') throw new Error();
    const lastExpense = await splitContract.getOwedExpense(
      address,
      ethers.BigNumber.from(owedExpensesCount).toNumber() - 1
    );
    console.log('Populating view with the expense: ', lastExpense);
    const [, , , tokenAddress, , , , , , , debtors] = lastExpense;
    const tokenContract = new ethers.Contract(tokenAddress, erc20ABI, provider);
    const tokenSymbol = await tokenContract.symbol();
    const { amount } = debtors.find(
      (debtor: any) => debtor._address === address
    );
    return {
      recipientToken: tokenSymbol,
      shareAmountInRecipientToken: ethers.BigNumber.from(amount).toNumber(),
    };
  };

  useEffect(() => {
    if (!signer || chain?.id !== LOCALHOST_CHAIN_ID) return;

    // If the dapp is connected to Localhost the user has 10k Matic which can
    // be converted to WMATIC to be used within the dApp
    fundWMATIC(signer);
  }, [signer]);

  const fundWMATIC = async (signer: ethers.Signer) => {
    const WMATICContract = new ethers.Contract(
      '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
      WMATICABI,
      signer
    );
    const balance = await WMATICContract.balanceOf(address);
    if (parseFloat(ethers.utils.formatEther(balance)) > 3000) return;
    await WMATICContract.deposit({ value: ethers.utils.parseEther('5000') });
  };

  const onChangeToken = async (event: ChangeEvent<HTMLSelectElement>) => {
    try {
      setPayFormData({
        ...payFormData,
        token: event.target.value as TokenSymbol,
      });

      await changePool(event.target.value, payFormData.recipientToken);

      const amountIn = await getQuoteReverse(
        payFormData.shareAmountInRecipientToken
      );
      setPayFormData((payFormData) => ({
        ...payFormData,
        shareAmount: parseFloat(amountIn),
        // As of right now network and swap fee is not fetched correctly and just mocked
        networkFee: 0.3,
        swapFee: 1,
      }));
    } catch (err) {
      toast.error(err as any);
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!fromToken || !pool || !signer) throw new Error();

    const res = await expenseService.payExpense(
      fromToken,
      pool.fee,
      payFormData.shareAmount,
      splitContract,
      signer,
      1
    );
    if (res < 0) {
      toast.error('Error processing payment');
    } else {
      toast.success('New payment made. Redirecting...');
    }
    Router.push(`/expense/view`);
    toggleViewPayForm();
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
        <p className="text-right">
          {payFormData.networkFee} {chain?.nativeCurrency?.symbol}
        </p>
        <p>Swap fee: </p>
        <p className="text-right">
          {payFormData.swapFee} {chain?.nativeCurrency?.symbol}
        </p>
        <span className="col-span-2 mt-2 flex justify-end text-muted text-xs flex items-center">
          <Image src={infoIcon} width={10} height={10} />
          <p className="ml-1">
            If your selected token diverges from the recipient's token a small
            fee has to be provided in order to swap the token.
          </p>
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 w-full gap-3 text-primary text-sm">
        <p>Total</p>
        <p className="text-right">{`${payFormData.shareAmount} ${
          payFormData.token
        } + ${payFormData.networkFee + payFormData.swapFee} ${
          chain?.nativeCurrency?.symbol
        }`}</p>
      </div>

      <div className="flex justify-end mt-7 gap-4">
        <Button
          Icon={CancelIcon}
          label="Cancel"
          theme="muted"
          onClick={toggleViewPayForm}
        />
        <Button
          Icon={CheckIcon}
          label="Confirm"
          type="submit"
          isDisabled={!payFormData.shareAmount}
        />
      </div>
    </form>
  );
};

export default Pay;
