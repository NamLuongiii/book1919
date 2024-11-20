"use client";

import clsx from "clsx";
import {
  InputHTMLAttributes,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { Accept, DropEvent, FileRejection, useDropzone } from "react-dropzone";

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "accept"> {
  maxMb?: number;
  accept?: Accept;
}

export const FileInput = ({ id, maxMb, accept, ...props }: Props) => {
  const [selected, setSelected] = useState<File[]>([]);
  const ref = useRef<HTMLInputElement>(null);

  const onDrop = useCallback(
    (acceptFiles: File[], fileRejected: FileRejection[], event: DropEvent) => {
      if (fileRejected.length) {
        alert(fileRejected.length + " " + "Files rejected");
      }

      const input = ref.current;
      if (!input) return;

      const dT = new DataTransfer();

      if (props.multiple && input.files) {
        for (const file of input.files) {
          dT.items.add(file);
        }
      }

      acceptFiles.forEach((file) => {
        dT.items.add(file);
      });

      input.files = dT.files;

      setSelected(Array.from(dT.files));
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: maxMb ? maxMb * 1000000 : undefined,
    multiple: props.multiple,
    accept,
  });

  const _accept = useMemo(() => {
    return accept ? Object.values(accept).join(",") : "*";
  }, [accept]);

  return (
    <div>
      <div
        {...getRootProps()}
        className={clsx("p-4 file-input", isDragActive && "!border-active")}
      >
        <input ref={ref} {...props} className="pointer-events-none" />
        <input id={id} type="file" {...getInputProps()} />
        <p>Or drag here</p>
        <small>
          Accept {_accept}
          {maxMb ? `, exceed to ${maxMb}mb` : ""}
        </small>
      </div>

      {selected.map((file, i) => (
        <p key={i}>{file.name}</p>
      ))}
    </div>
  );
};
