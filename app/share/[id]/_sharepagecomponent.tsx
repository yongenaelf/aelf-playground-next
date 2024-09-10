"use client";

import { useShare } from "@/data/client";
import { db } from "@/data/db";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function SharePageComponent({ id }: { id: string }) {
  const { data, isLoading, error } = useShare(id);
  const router = useRouter();

  useEffect(() => {
    async function importWorkspace() {
      if (!data) return;

      const existing = await db.workspaces.get(id);
      if (existing) {
        router.push(`/workspace/${id}`);
      } else {
        await db.workspaces.add({name: id, template: id, dll: ''});

        await db.files.bulkAdd(
          data.map(({ path, contents }) => ({
            path: `/workspace/${id}/${encodeURIComponent(path)}`,
            contents,
          }))
        );
        router.push(`/workspace/${id}`);
      }
    }

    importWorkspace();
  }, [id, data])

  if (isLoading) return <p>Loading...</p>;
  else if (error) return <p>Error: {String(error)}</p>;

  return <p>Loading...</p>;
}
