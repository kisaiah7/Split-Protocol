import { ChangeEvent } from 'react';

type Props = {
  options: string[];
  value: string;
  placeholder: string;
  name: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
};

const Select = ({ options, name, value, placeholder, onChange }: Props) => {
  return (
    <select
      className="w-full bg-form-field text-secondary text-sm px-3 py-2 rounded-sm"
      value={value}
      name={name}
      onChange={onChange}
    >
      <option disabled hidden value="">
        {placeholder}
      </option>
      {options.map((option, index) => (
        <option key={index}>{option}</option>
      ))}
    </select>
  );
};
export default Select;
