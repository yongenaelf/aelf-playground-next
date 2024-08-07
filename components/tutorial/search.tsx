"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

export function TutorialSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
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
    router.push(pathname + createQueryString(search));
  }, [search]);

  return (
    <Input
      value={search}
      placeholder="Search tutorials..."
      onChange={(e) => setSearch(e.target.value)}
      className="w-1/2 mb-8"
    />
  );
}
