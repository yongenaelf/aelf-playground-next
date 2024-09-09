"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useTutorialList } from "@/data/client";
import { List } from "@/components/listing-page/list";

export function TutorialList() {
  const searchParams = useSearchParams();
  const { data } = useTutorialList();

  const list = useMemo(() => {
    if (!data) return [];

    let all = data;

    const level = searchParams.getAll("level");
    const lang = searchParams.getAll("lang");
    const search = searchParams.get("search");

    if (level.length > 0) all = all.filter((i) => level.includes(i.levelId));

    if (lang.length > 0) all = all.filter((i) => lang.includes(i.langId));

    if (search && search.length > 0)
      all = all.filter(
        (i) =>
          i.title.toLowerCase().includes(search) ||
          i.description.toLowerCase().includes(search)
      );

    return all.map((i) => ({
      ...i,
      tags: [i.level, i.lang],
      link: `/tutorials/${i.id}`,
    }));
  }, [data, searchParams]);

  return <List list={list} />;
}
