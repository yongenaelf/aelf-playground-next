"use client";

import { db } from "@/data/db";
import { usePathname } from "next/navigation";
import useSWR, { mutate } from "swr";
import { FileExplorerTopMenu } from "./file-explorer-top-menu";
import TreeView, { flattenTree } from "react-accessible-treeview";
import { FolderOpen, FolderClosed } from "lucide-react";
import { FileIcon } from "./file-icon";
import "./file-explorer.css";
import { useSetSearchParams } from "@/lib/set-search-params";

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
            if (!props.isBranch) {
              // file

              const { path } = props.element.metadata || {};

              if (path) setSearchParams("file", encodeURIComponent(path));
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
              <span className="flex px-2">
                <span className="my-1">
                  {isBranch ? (
                    <FolderIcon isOpen={isExpanded} />
                  ) : (
                    <FileIcon filename={element.name} />
                  )}
                </span>
                <span className="ml-2 line-clamp-1">{element.name}</span>
              </span>
            </div>
          )}
        />
      </div>
    </>
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
