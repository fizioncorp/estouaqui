import clsx from "clsx";
import type { PropsWithChildren } from "react";

export function Badge({
  children,
  tone = "neutral"
}: PropsWithChildren<{ tone?: "neutral" | "success" | "warning" | "danger" }>) {
  return (
    <span
      className={clsx(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
        tone === "neutral" && "bg-mist text-ink",
        tone === "success" && "bg-mint text-forest",
        tone === "warning" && "bg-sky text-forest",
        tone === "danger" && "bg-[#fde7e4] text-danger"
      )}
    >
      {children}
    </span>
  );
}
