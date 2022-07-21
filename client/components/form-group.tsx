import { ReactNode } from "react";

type Props = {
  label: string;
  formControl: ReactNode;
  className?: string;
};

const FormGroup = ({ label, formControl, className }: Props) => {
  return (
    <div className={className}>
      <label className="flex flex-col gap-2 text-muted text-xs">
        {label}
        {formControl}
      </label>
    </div>
  );
};
export default FormGroup;
