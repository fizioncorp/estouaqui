import clsx from "clsx";
import type { PropsWithChildren } from "react";

export function Alert({
  children,
  tone = "info"
}: PropsWithChildren<{ tone?: "info" | "danger" | "success" }>) {
  return (
    <div
      className={clsx(
        "rounded-3xl p-4 text-sm leading-6",
        tone === "info" && "bg-sky/70 text-forest ring-1 ring-sky",
        tone === "danger" && "bg-[#fde7e4] text-danger ring-1 ring-danger/15",
        tone === "success" && "bg-mint text-forest ring-1 ring-forest/10"
      )}
    >
      {children}
    </div>
  );
}
