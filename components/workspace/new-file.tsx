"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useState } from "react";
import { FilePlus } from "lucide-react";
import { NewFileForm } from "./new-file-form";
import { Tooltip } from "../tooltip";

export default function NewFile() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger asChild>
        <Tooltip text="Add file...">
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
            <FilePlus className="h-4 w-4" />
          </Button>
        </Tooltip>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New File</DialogTitle>
          <DialogDescription>
            <NewFileForm onSubmit={() => setIsOpen(false)} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
