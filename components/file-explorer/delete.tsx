"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { db } from "@/data/db";
import { usePathname } from "@/lib/use-pathname";
import { useRefreshFileExplorer } from "./";

export default function Delete({
  type,
  path,
  isOpen,
  setIsOpen,
}: React.PropsWithChildren<{
  type?: "file" | "folder";
  path?: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}>) {
  const pathname = usePathname();
  const refreshFileExplorer = useRefreshFileExplorer();

  if (!path) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {type}</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {path}? This action is not
            reversible!
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={async () => {
              if (type === "file") {
                await db.files.delete(
                  `${pathname}/${path}`
                );
              } else {
                const all = (
                  await db.files
                    .filter((file) =>
                      file.path.startsWith(
                        `${pathname}/${path}/`
                      )
                    )
                    .toArray()
                ).map((i) => i.path);
                await db.files.bulkDelete(all);
              }

              await refreshFileExplorer();
              setIsOpen(false);
            }}
          >
            Confirm
          </Button>
          <Button onClick={() => setIsOpen(false)}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
