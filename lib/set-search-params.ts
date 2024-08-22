"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";

export function useSetSearchParams() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const createQueryString = useCallback(
    (key: string, value?: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(key);

      if (value) params.set(key, value);

      const res = params.toString();

      if (res) return "?" + res;

      return "";
    },
    [searchParams]
  );

  return (key: string, value?: string) => {
    router.push(pathname + createQueryString(key, value));
  };
}
