import { ChangeEvent } from 'react';

type Props = {
  value: string;
  placeholder: string;
  name: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
};

const TextArea = ({ placeholder, value, name, onChange }: Props) => {
  return (
    <textarea
      className="w-full bg-form-field text-secondary text-sm px-3 py-2 rounded-sm resize-none"
      rows={4}
      placeholder={placeholder}
      value={value}
      name={name}
      onChange={onChange}
    ></textarea>
  );
};
export default TextArea;
