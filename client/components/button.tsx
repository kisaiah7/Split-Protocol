import classNames from 'classnames';

type Props = {
  label: string;
  Icon: React.FunctionComponent;
  theme?: 'normal' | 'condensed';
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
};

const Button = ({
  label,
  Icon,
  theme = 'normal',
  type = 'button',
  className,
  onClick,
}: Props) => {
  return (
    <button
      className={classNames(
        'text-primary flex items-center gap-2  tracking-widest  text-sm',
        {
          'bg-btn-gradient px-2 py-1 rounded-sm': theme === 'normal',
        },
        className
      )}
      onClick={onClick}
      type={type}
    >
      <Icon />
      <span>{label}</span>
    </button>
  );
};
export default Button;
