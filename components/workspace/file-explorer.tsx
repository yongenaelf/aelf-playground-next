"use client";

import { db } from "@/data/db";
import { usePathname } from "next/navigation";
import useSWR, { mutate } from "swr";
import { FileExplorerTopMenu } from "./file-explorer-top-menu";
import TreeView, { flattenTree, INode } from "react-accessible-treeview";
import { FolderOpen, FolderClosed } from "lucide-react";
import { FileIcon } from "./file-icon";
import "./file-explorer.css";
import { useSetSearchParams } from "@/lib/set-search-params";
import { FileContextMenu, FolderContextMenu, IAction } from "./context-menu";
import { IFlatMetadata } from "react-accessible-treeview/dist/TreeView/utils";
import { useState } from "react";
import Rename from "./rename";
import Delete from "./delete";

interface TreeViewElement {
  name: string;
  children?: TreeViewElement[];
}

function convert(data: string[]) {
  const map = new Map();
  const root: TreeViewElement = {
    name: "",
    children: [],
  };
  for (const name of data) {
    let path = "";
    let parent = root;
    for (const label of name.split("/")) {
      path += "/" + label;
      let node = map.get(path);
      if (!node) {
        map.set(
          path,
          (node = {
            name: label,
            metadata: { path: path.slice(1) },
          } as TreeViewElement)
        );
        (parent.children ??= []).push(node);
      }
      parent = node;
    }
  }
  return flattenTree(root);
}

const FileExplorer = () => {
  const pathname = usePathname();
  const setSearchParams = useSetSearchParams();
  const [selectedPath, setSelectedPath] = useState<string>();
  const [showRename, setShowRename] = useState(false);
  const [type, setType] = useState<"file" | "folder">();
  const [showDelete, setShowDelete] = useState(false);

  const { data } = useSWR(`file-explorer-${pathname}`, async () => {
    const files = await db.files.filter((file) =>
      file.path.startsWith(pathname + "/")
    );
    const filesArray = await files.toArray();
    return convert(
      filesArray.map((i) =>
        decodeURIComponent(i.path.replace(`${pathname}/`, ""))
      )
    );
  });

  if (!data) return <p>Loading...</p>;

  return (
    <>
      <FileExplorerTopMenu />
      <div className="file-tree">
        <TreeView
          data={data}
          aria-label="directory tree"
          onNodeSelect={(props) => {
            const { path } = props.element.metadata || {};

            if (typeof path !== "string") return;

            if (!props.isBranch) {
              setSearchParams("file", encodeURIComponent(path));
            }
          }}
          nodeRenderer={({
            element,
            isBranch,
            isExpanded,
            getNodeProps,
            level,
          }) => (
            <div {...getNodeProps()} style={{ paddingLeft: 20 * (level - 1) }}>
              <NodeRenderer
                isBranch={isBranch}
                isExpanded={isExpanded}
                element={element}
                handleClick={(action) => {
                  setType(isBranch ? "folder" : "file");
                  setSelectedPath(String(element.metadata!.path));

                  switch (action) {
                    case IAction.RENAME:
                      setShowRename(true);
                      break;
                    case IAction.DELETE:
                      setShowDelete(true);
                      break;
                  }
                }}
              />
            </div>
          )}
        />
      </div>
      <Rename
        type={type}
        path={selectedPath}
        isOpen={showRename}
        setIsOpen={setShowRename}
      />
      <Delete
        type={type}
        path={selectedPath}
        isOpen={showDelete}
        setIsOpen={setShowDelete}
      />
    </>
  );
};

export type Element = INode<IFlatMetadata>;

const NodeRenderer = ({
  isBranch,
  isExpanded,
  element,
  handleClick,
}: {
  isBranch: boolean;
  isExpanded: boolean;
  element: Element;
  handleClick: (action: IAction) => void;
}) => {
  const { name } = element;
  const node = (
    <span className="flex px-2">
      <span className="my-1">
        {isBranch ? (
          <FolderIcon isOpen={isExpanded} />
        ) : (
          <FileIcon filename={name} />
        )}
      </span>
      <span className="ml-2 line-clamp-1">{name}</span>
    </span>
  );

  return isBranch ? (
    <FolderContextMenu handleClick={handleClick}>{node}</FolderContextMenu>
  ) : (
    <FileContextMenu handleClick={handleClick}>{node}</FileContextMenu>
  );
};

const FolderIcon = ({ isOpen }: { isOpen: boolean }) =>
  isOpen ? (
    <FolderOpen className="w-4 h-4" />
  ) : (
    <FolderClosed className="w-4 h-4" />
  );

/**
 *
 * @returns Function to refresh the file explorer in the current view
 */
export const useRefreshFileExplorer = () => {
  const pathname = usePathname();
  return () => mutate(`file-explorer-${pathname}`);
};

export default FileExplorer;
