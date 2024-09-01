import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Pencil, Delete, FilePlus, FolderPlus } from "lucide-react";
import { Element } from "./file-explorer";

export function FileContextMenu({
  children,
}: React.PropsWithChildren<{ element: Element }>) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent
        className="w-64"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <ContextMenuItem>
          <Pencil className="w-4 h-4 mr-2" />
          <span>Rename</span>
          <ContextMenuShortcut>F2</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <Delete className="w-4 h-4 mr-2" />
          <span>Delete</span>
          <ContextMenuShortcut>Del</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export function FolderContextMenu({
  children,
}: React.PropsWithChildren<{ element: Element }>) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent
        className="w-64"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <ContextMenuItem>
          <FilePlus className="w-4 h-4 mr-2" />
          <span>New File</span>
          <ContextMenuShortcut>Ctrl+N</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <FolderPlus className="w-4 h-4 mr-2" />
          <span>New Folder</span>
          <ContextMenuShortcut>Ctrl+Shift+N</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <Pencil className="w-4 h-4 mr-2" />
          <span>Rename</span>
          <ContextMenuShortcut>F2</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <Delete className="w-4 h-4 mr-2" />
          <span>Delete</span>
          <ContextMenuShortcut>Del</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
