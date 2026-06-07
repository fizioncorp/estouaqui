import clsx from "clsx";
import type { SelectHTMLAttributes } from "react";

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={clsx(
        "w-full rounded-2xl border border-forest/15 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-pine",
        className
      )}
      {...props}
    />
  );
}
