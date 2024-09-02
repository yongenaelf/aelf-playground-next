"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { RenameForm } from "./rename-form";

export default function Rename({
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
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename {type}</DialogTitle>
          <DialogDescription>
            <RenameForm
              type={type}
              path={path}
              onSubmit={() => setIsOpen(false)}
            />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
