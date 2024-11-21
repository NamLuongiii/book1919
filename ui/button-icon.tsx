import { Button as _Button, ButtonProps } from "@headlessui/react";
import clsx from "clsx";
import { forwardRef } from "react";
import { Icon, IIcons } from "./icon";

type Props = ButtonProps & {
  icon: IIcons;
  color?: string;
};

const ButtonIcon = forwardRef<HTMLButtonElement, Props>(
  ({ icon, color, ...props }, ref) => {
    return (
      <_Button
        {...props}
        ref={ref}
        className={clsx(
          props.className,
          "p-1 flex items-center justify-center hover:bg-gray-200 active:bg-gray-300"
        )}
      >
        <Icon icon={icon} />
      </_Button>
    );
  }
);

export { ButtonIcon };
