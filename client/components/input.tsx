import { ChangeEvent } from 'react';

type Props = {
  placeholder: string;
  value: string;
  name: string;
  type?: 'text' | 'number' | 'email' | 'password';
  isDisabled?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const Input = ({
  placeholder,
  name,
  value,
  type = 'text',
  isDisabled = false,
  onChange,
}: Props) => {
  return (
    <input
      className="w-full bg-form-field text-secondary text-sm px-3 py-2 rounded-sm disabled:grayscale"
      placeholder={placeholder}
      type={type}
      name={name}
      value={value}
      disabled={isDisabled}
      onChange={onChange}
    ></input>
  );
};
export default Input;
