import type { PropsWithChildren } from "react";
import { Button } from "./Button";
import { Card } from "./Card";

export function Modal({
  title,
  open,
  onClose,
  children
}: PropsWithChildren<{
  title: string;
  open: boolean;
  onClose: () => void;
}>) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
      <Card className="w-full max-w-lg">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h3 className="text-xl font-semibold text-forest">{title}</h3>
          <Button variant="ghost" onClick={onClose}>
            Fechar
          </Button>
        </div>
        {children}
      </Card>
    </div>
  );
}
