import { ReactNode } from "react";

export function Wrapper({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto flex max-w-2xl flex-col px-4">
      {children}
    </div>
  );
}
