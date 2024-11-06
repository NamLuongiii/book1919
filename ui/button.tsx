import { Button as _Button, ButtonProps } from "@headlessui/react";
import clsx from "clsx";
import { forwardRef } from "react";

type Props = ButtonProps & {};

const Button = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  return (
    <_Button
      {...props}
      ref={ref}
      className={clsx(
        "rounded bg-sky-600 py-2 px-4 text-sm text-white data-[hover]:bg-sky-500 data-[active]:bg-sky-700",
        props.className
      )}
    >
      {props.children}
    </_Button>
  );
});

export { Button };
