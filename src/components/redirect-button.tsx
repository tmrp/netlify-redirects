"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { useTransition } from "react";

export function RedirectButton() {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const randomQueryString = Math.random().toString(36).substring(7);

  const handleClick = () => {
    startTransition(() => {
      router.push(`/redirect/random/from/${randomQueryString}`);
      router.refresh();
    });
  };

  return (
    <Button className="max-w-fit" onClick={handleClick} disabled={isPending}>
      Redirect to random route
    </Button>
  );
}
