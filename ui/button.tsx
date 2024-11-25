import { Button as _Button, ButtonProps } from "@headlessui/react";
import clsx from "clsx";
import Link from "next/link";
import { forwardRef } from "react";

type Props = ButtonProps & {
  to_href?: string;
};

const Button = forwardRef<HTMLButtonElement, Props>(
  ({ to_href, ...props }, ref) => {
    if (to_href)
      return (
        <Link href={to_href}>
          <_Button
            {...props}
            ref={ref}
            className={clsx("border border-foreground px-2", props.className)}
          >
            {props.children}
          </_Button>
        </Link>
      );

    return (
      <_Button
        {...props}
        ref={ref}
        className={clsx("border border-foreground px-2", props.className)}
      >
        {props.children}
      </_Button>
    );
  }
);

export { Button };
