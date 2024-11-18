"use client";

import { usePathname } from "@/lib/use-pathname";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

export function useSetSearchParams() {
  const [searchParams] = useSearchParams();
  const pathname = usePathname();
  const navigate = useNavigate();

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
    navigate(pathname + createQueryString(paramsObj));
  };
}
