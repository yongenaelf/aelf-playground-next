"use client";

import { usePathname } from "@/lib/use-pathname";
import { useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

export function Search({placeholder}: {placeholder?: string}) {
  const [searchParams] = useSearchParams();
  const pathname = usePathname();
  const navigate = useNavigate();
  const [search, setSearch] = useState(searchParams.get("search") || undefined);

  const createQueryString = useCallback(
    (value?: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("search");

      if (value) params.set("search", value);

      const res = params.toString();

      if (res) return "?" + res;

      return "";
    },
    [searchParams]
  );

  useEffect(() => {
    navigate(pathname + createQueryString(search));
  }, [search]);

  return (
    <Input
      value={search}
      placeholder={placeholder ?? "Search..."}
      onChange={(e) => setSearch(e.target.value)}
      className="w-1/2 mb-8"
    />
  );
}
