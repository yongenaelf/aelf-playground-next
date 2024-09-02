"use client";

import { INode } from "react-accessible-treeview";
import { FileIcon } from "./file-icon";
import { FileContextMenu, FolderContextMenu, IAction } from "./context-menu";
import { IFlatMetadata } from "react-accessible-treeview/dist/TreeView/utils";
import { FolderIcon } from "./folder-icon";
import { IFileExplorerActionKind } from "./file-explorer-reducer";
import { useFileExplorerContext } from "./file-explorer-context";

type Element = INode<IFlatMetadata>;

export const NodeRenderer = ({
  isBranch,
  isExpanded,
  element,
}: {
  isBranch: boolean;
  isExpanded: boolean;
  element: Element;
}) => {
  const [_, dispatch] = useFileExplorerContext();
  const { name } = element;

  const handleClick = (action: IAction) => {
    switch (action) {
      case IAction.DELETE:
        dispatch({
          type: IFileExplorerActionKind.DELETE,
          payload: {
            type: isBranch ? "folder" : "file",
            path: element.id as string,
          },
        });
        break;
      case IAction.RENAME:
        dispatch({
          type: IFileExplorerActionKind.RENAME,
          payload: {
            type: isBranch ? "folder" : "file",
            path: element.id as string,
          },
        });
        break;
      case IAction.NEW_FILE:
        dispatch({
          type: IFileExplorerActionKind.ADD,
          payload: {
            type: "file",
            path: element.id as string,
          },
        });
        break;
      case IAction.NEW_FOLDER:
        dispatch({
          type: IFileExplorerActionKind.ADD,
          payload: {
            type: "folder",
            path: element.id as string,
          },
        });
        break;
    }
  };

  if (name.startsWith(".")) return null;

  return isBranch ? (
    <FolderContextMenu handleClick={handleClick}>
      <span className="flex px-2">
        <span className="my-1">
          <FolderIcon isOpen={isExpanded} />
        </span>
        <span className="ml-2 line-clamp-1">{name}</span>
      </span>
    </FolderContextMenu>
  ) : (
    <FileContextMenu handleClick={handleClick}>
      <span className="flex px-2">
        <span className="my-1">
          <FileIcon filename={name} />
        </span>
        <span className="ml-2 line-clamp-1">{name}</span>
      </span>
    </FileContextMenu>
  );
};
