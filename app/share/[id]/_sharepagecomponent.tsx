"use client";

import { useShare } from "@/data/client";
import { db } from "@/data/db";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function SharePageComponent({ id }: { id: string }) {
  const { data, isLoading } = useShare(id);
  const router = useRouter();

  useEffect(() => {
    async function importWorkspace() {
      if (!data?.files) return;

      const existing = await db.workspaces.get(id);
      if (existing) {
        router.push(`/workspace/${id}`);
      } else {
        await db.workspaces.add({ name: id, template: id, dll: "" });

        await db.files.bulkAdd(
          data.files.map(({ path, contents }) => ({
            path: `/workspace/${id}/${encodeURIComponent(path)}`,
            contents,
          }))
        );
        router.push(`/workspace/${id}`);
      }
    }

    importWorkspace();
  }, [id, data]);

  if (data?.success === false)
    return (
      <Dialog open onOpenChange={() => router.push("/")}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>
              {data.message}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  if (isLoading) return <p>Loading...</p>;

  return <p>Loading...</p>;
}
