import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogTitleProps,
} from "@headlessui/react";
import clsx from "clsx";
import { forwardRef, ReactNode } from "react";

interface Props {
  open: boolean;
  onChange(open: boolean): void;
  children: ReactNode;
  className?: string;
}

export function Modal({ open, onChange, children, className }: Props) {
  return (
    <Dialog
      open={open}
      onClose={() => onChange(false)}
      className="relative z-50 "
    >
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel
          className={clsx("space-y-4 border bg-white p-12", className)}
        >
          {children}
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export const ModalTitle = forwardRef<HTMLDivElement, DialogTitleProps>(
  (props, ref) => (
    <DialogTitle
      {...props}
      ref={ref}
      className={clsx("font-bold", props.className)}
    />
  )
);
export const ModalDescription = Description;
