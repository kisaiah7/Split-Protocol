import FormGroup from './form-group';
import Input from './input';
// @ts-ignore
import CloseIcon from '../public/close-icon.svg?inline';
import Debtor from '../models/debtor';
import { ChangeEvent } from 'react';

type Props = {
  debtor: Debtor;
  isRemovable?: boolean;
  onClickRemoveButton: () => void;
  onChange: (debtor: Debtor) => void;
};

const DebtorListItem = ({
  debtor,
  isRemovable = true,
  onClickRemoveButton,
  onChange,
}: Props) => {
  const onChangeInterceptor = ({
    target: { name, value },
  }: ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...debtor,
      [name]: name === 'amount' ? (value ? parseInt(value) : 0) : value,
    });
  };

  return (
    <li className="relative grid grid-cols-2 gap-2 bg-tertiary px-4 pt-6 pb-4 rounded-xl">
      {isRemovable && (
        <button
          className="absolute top-4 right-4"
          onClick={onClickRemoveButton}
          type="button"
        >
          <CloseIcon />
        </button>
      )}
      <FormGroup
        label="Debtor"
        formControl={
          <Input
            name="address"
            value={debtor.address}
            placeholder="Address"
            isDisabled={!isRemovable}
            onChange={onChangeInterceptor}
          />
        }
      />
      <FormGroup
        label="Amount"
        formControl={
          <Input
            name="amount"
            value={debtor.amount.toString()}
            placeholder="4000"
            type="number"
            onChange={onChangeInterceptor}
          />
        }
      />
    </li>
  );
};
export default DebtorListItem;
