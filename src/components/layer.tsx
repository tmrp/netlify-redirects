import { ReactNode } from "react";

export function Layer({ children }: { children: ReactNode }) {
  return <div className="flex rounded-md bg-slate-300 p-4">{children}</div>;
}
