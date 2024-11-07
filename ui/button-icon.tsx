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
          "rounded-full border shadow p-2 bg-white flex items-center justify-center"
        )}
      >
        <Icon icon={icon} />
      </_Button>
    );
  }
);

export { ButtonIcon };
