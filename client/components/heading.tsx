import classNames from "classnames";
import { ReactNode } from "react";

type Props = {
  type: "primary" | "secondary" | "tertiary";
  children: ReactNode;
  className?: string;
};

const Heading = ({ type, children, className }: Props) => {
  const renderHeading = () => {
    switch (type) {
      case "primary":
        return (
          <h1
            className={classNames(
              "text-primary font-sans text-5xl leading-tight font-bold",
              className
            )}
          >
            {children}
          </h1>
        );
      case "secondary":
        return (
          <h2
            className={classNames(
              "text-primary font-sans text-3xl leading-normal font-bold",
              className
            )}
          >
            {children}
          </h2>
        );
      case "tertiary":
        return (
          <h3
            className={classNames(
              "text-primary font-sans text-xl leading-normal font-bold",
              className
            )}
          >
            {children}
          </h3>
        );
      default:
        return <></>;
    }
  };

  return renderHeading();
};
export default Heading;
