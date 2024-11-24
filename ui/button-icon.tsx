import { ButtonProps } from "@headlessui/react";
import clsx from "clsx";
import { forwardRef } from "react";
import { Icon, IIcons } from "./icon";

type Props = ButtonProps & {
  icon: IIcons;
  color?: string;
};

const ButtonIcon = forwardRef<HTMLSpanElement, Props>(
  ({ icon, color, ...props }, ref) => {
    return (
      <span
        {...props}
        ref={ref}
        className={clsx(
          props.className,
          "p-1 w-fit flex items-center justify-center hover:bg-gray-200 active:bg-gray-300 rounded-sm"
        )}
      >
        <Icon icon={icon} color={props.disabled ? "#d1d5db" : undefined} />
      </span>
    );
  }
);

export { ButtonIcon };
