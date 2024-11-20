"use client";

import { forwardRef, InputHTMLAttributes, useState } from "react";

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {}

export const TextInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const [value, setValue] = useState("");

  const remain = props.maxLength ? props.maxLength - value.length : 0;

  return (
    <div className="text-input">
      <input
        ref={ref}
        type="text"
        {...props}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
      {!!remain && !!value && (
        <span className="text-input-remain" title="Charactors remain">
          {remain}
        </span>
      )}
    </div>
  );
});
