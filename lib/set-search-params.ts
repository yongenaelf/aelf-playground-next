"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";

export function useSetSearchParams() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const createQueryString = useCallback(
    (paramsObj: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.keys(paramsObj).forEach((key) => {
        params.delete(key);
        const value = paramsObj[key];
        if (value) {
          params.set(key, value);
        }
      });

      const res = params.toString();

      if (res) return "?" + res;

      return "";
    },
    [searchParams]
  );

  return (paramsObj: Record<string, string | undefined>) => {
    router.push(pathname + createQueryString(paramsObj));
  };
}
