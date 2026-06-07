import clsx from "clsx";
import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type Props = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "ghost" | "danger";
    fullWidth?: boolean;
  }
>;

export function Button({
  children,
  className,
  variant = "primary",
  fullWidth,
  ...props
}: Props) {
  return (
    <button
      className={clsx(
        "rounded-2xl px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" && "bg-forest text-white hover:bg-pine",
        variant === "secondary" && "bg-mint text-forest hover:bg-[#cde8df]",
        variant === "ghost" && "bg-white/70 text-forest ring-1 ring-forest/15 hover:bg-white",
        variant === "danger" && "bg-danger text-white hover:bg-[#8d1a12]",
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
