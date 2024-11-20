import { Button as _Button, ButtonProps } from "@headlessui/react";
import clsx from "clsx";
import { forwardRef } from "react";

type Props = ButtonProps & {};

const Button = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  return (
    <_Button {...props} ref={ref} className={clsx("rounded", props.className)}>
      {props.children}
    </_Button>
  );
});

export { Button };
