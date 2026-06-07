import type { PropsWithChildren } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
