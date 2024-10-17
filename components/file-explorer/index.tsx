"use client";

import { db } from "@/data/db";
import { usePathname } from "next/navigation";
import useSWR, { mutate } from "swr";
import { FileExplorerTopMenu } from "./file-explorer-top-menu";
import TreeView, { flattenTree } from "react-accessible-treeview";
import "./file-explorer.css";
import { useSetSearchParams } from "@/lib/set-search-params";
import Rename from "./rename";
import Delete from "./delete";
import {
  IFileExplorerActionKind,
  useFileExplorerReducer,
} from "./file-explorer-reducer";
import { NodeRenderer } from "./file-explorer-node-renderer";
import { FileExplorerContext } from "./file-explorer-context";

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
            id: path.slice(1),
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
  const refreshFileExplorer = useRefreshFileExplorer();

  const [state, dispatch] = useFileExplorerReducer();

  const { data } = useSWR(`file-explorer-${pathname}`, async () => {
    const files = await db.files.filter(file =>
      file.path.startsWith(pathname + "/")
    );
    const filesArray = await files.toArray();
    return convert(
      filesArray.map(i =>
        decodeURIComponent(i.path.replace(`${pathname}/`, ""))
      )
    );
  });

  if (!data) return <p>Loading...</p>;

  return (
    <FileExplorerContext.Provider value={[state, dispatch]}>
      <FileExplorerTopMenu />
      <div className="file-tree h-[calc(100%-114px)] overflow-auto">
        <TreeView
          data={data}
          focusedId={state.focusedId}
          aria-label="directory tree"
          onNodeSelect={props => {
            const { id } = props.element;

            if (typeof id !== "string") return;

            const { children } = props.element;

            dispatch({
              type: IFileExplorerActionKind.SELECT,
              payload: {
                type: children.length > 0 ? "folder" : "file",
                path: id,
              },
            });

            if (children.length === 0) {
              setSearchParams({ file: encodeURIComponent(id) });
            }
          }}
          // @ts-expect-error
          onKeyDown={(e: React.KeyboardEvent<HTMLSpanElement>) => {
            if (e.key === "F2") {
              e.stopPropagation();

              dispatch({ type: IFileExplorerActionKind.RENAME });
            }

            if (e.code === "Delete") {
              e.stopPropagation();

              dispatch({ type: IFileExplorerActionKind.DELETE });
            }

            if (state.type === "folder") {
              if (e.ctrlKey && e.key.toUpperCase() === "N") {
                if (e.shiftKey) {
                  dispatch({
                    type: IFileExplorerActionKind.ADD,
                    payload: {
                      type: "folder",
                    },
                  });
                } else {
                  dispatch({
                    type: IFileExplorerActionKind.ADD,
                    payload: {
                      type: "file",
                    },
                  });
                }
              }
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
              />
              {state.showAdd && state.path === element.id ? (
                <input
                  ref={ref => {
                    setTimeout(() => {
                      ref?.focus();
                    }, 200);
                  }}
                  className="ml-8"
                  onBlur={() =>
                    dispatch({ type: IFileExplorerActionKind.CLOSE_MODAL })
                  }
                  onKeyDown={async e => {
                    if (e.key === "Escape")
                      dispatch({ type: IFileExplorerActionKind.CLOSE_MODAL });

                    if (e.key === "Enter") {
                      await db.files.add({
                        path: `${pathname}/${encodeURIComponent(
                          `${state.path}/${e.currentTarget.value}${
                            state.addType === "folder" ? "/.gitkeep" : ""
                          }`
                        )}`,
                        contents: "",
                      });
                      await refreshFileExplorer();
                      dispatch({ type: IFileExplorerActionKind.CLOSE_MODAL });
                    }
                  }}
                />
              ) : null}
            </div>
          )}
        />
      </div>
      <Rename
        type={state.type}
        path={state.path}
        isOpen={state.showRename}
        setIsOpen={() =>
          dispatch({ type: IFileExplorerActionKind.CLOSE_MODAL })
        }
      />
      <Delete
        type={state.type}
        path={state.path}
        isOpen={state.showDelete}
        setIsOpen={() =>
          dispatch({ type: IFileExplorerActionKind.CLOSE_MODAL })
        }
      />
    </FileExplorerContext.Provider>
  );
};

/**
 *
 * @returns Function to refresh the file explorer in the current view
 */
export const useRefreshFileExplorer = () => {
  const pathname = usePathname();
  return () => mutate(`file-explorer-${pathname}`);
};

export default FileExplorer;
