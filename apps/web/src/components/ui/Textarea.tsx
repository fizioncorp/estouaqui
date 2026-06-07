import clsx from "clsx";
import type { TextareaHTMLAttributes } from "react";

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={clsx(
        "min-h-[120px] w-full rounded-2xl border border-forest/15 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/45 focus:border-pine",
        className
      )}
      {...props}
    />
  );
}
