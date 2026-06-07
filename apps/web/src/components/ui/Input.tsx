import clsx from "clsx";
import type { InputHTMLAttributes } from "react";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={clsx(
        "w-full rounded-2xl border border-forest/15 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/45 focus:border-pine",
        className
      )}
      {...props}
    />
  );
}
