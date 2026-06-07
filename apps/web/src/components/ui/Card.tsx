import clsx from "clsx";
import type { HTMLAttributes, PropsWithChildren } from "react";

export function Card({
  children,
  className,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      className={clsx(
        "rounded-4xl bg-white/90 p-6 shadow-soft ring-1 ring-forest/8 backdrop-blur",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
