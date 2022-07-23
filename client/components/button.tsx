import classNames from 'classnames';

type Props = {
  label: string;
  Icon: React.FunctionComponent;
  theme?: 'normal' | 'muted' | 'condensed';
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  isDisabled?: boolean;
};

const Button = ({
  label,
  Icon,
  theme = 'normal',
  type = 'button',
  className,
  isDisabled = false,
  onClick,
}: Props) => {
  return (
    <button
      className={classNames(
        'text-primary flex items-center gap-2  tracking-widest  text-sm',
        {
          'px-2 py-1 rounded-sm': theme === 'normal' || theme === 'muted',
          'bg-btn-gradient': theme === 'normal',
          'bg-cancel-gradient': theme === 'muted',
          'grayscale-[.3]': isDisabled,
        },
        className
      )}
      onClick={onClick}
      type={type}
      disabled={isDisabled}
    >
      <Icon />
      <span>{label}</span>
    </button>
  );
};
export default Button;
