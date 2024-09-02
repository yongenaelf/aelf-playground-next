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
import { useReducer } from "react";
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

// An enum with all the types of actions to use in our reducer
enum IFileExplorerActionKind {
  RENAME,
  DELETE,
  SELECT,
  CLOSE_MODAL,
  ADD,
}

type FileOrFolder = "file" | "folder";

// An interface for our actions
interface IFileExplorerAction {
  type: IFileExplorerActionKind;
  payload?: { path?: string; type?: FileOrFolder };
}

// An interface for our state
interface IFileExplorerState {
  showRename: boolean;
  showDelete: boolean;
  path?: string;
  type?: FileOrFolder;
  focusedId?: string;
  showAdd: boolean;
  addType?: FileOrFolder;
}

const initialState: IFileExplorerState = {
  showRename: false,
  showDelete: false,
  showAdd: false,
};

// Our reducer function that uses a switch statement to handle our actions
function reducer(state: IFileExplorerState, action: IFileExplorerAction) {
  const { type, payload } = action;
  switch (type) {
    case IFileExplorerActionKind.RENAME:
      return {
        ...state,
        ...(payload || {}),
        showRename: true,
      };
    case IFileExplorerActionKind.DELETE:
      return {
        ...state,
        ...(payload || {}),
        showDelete: true,
      };
    case IFileExplorerActionKind.SELECT:
      return {
        ...state,
        ...(payload || {}),
      };
    case IFileExplorerActionKind.CLOSE_MODAL:
      return {
        ...state,
        showRename: false,
        showDelete: false,
        showAdd: false,
      };
    case IFileExplorerActionKind.ADD:
      return {
        ...state,
        addType: payload?.type,
        showAdd: true,
      };
    default:
      return state;
  }
}

const FileExplorer = () => {
  const pathname = usePathname();
  const setSearchParams = useSetSearchParams();
  const refreshFileExplorer = useRefreshFileExplorer();

  const [state, dispatch] = useReducer(reducer, initialState);

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
          focusedId={state.focusedId}
          aria-label="directory tree"
          onNodeSelect={(props) => {
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
              setSearchParams("file", encodeURIComponent(id));
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
                handleRename={() =>
                  dispatch({
                    type: IFileExplorerActionKind.RENAME,
                    payload: {
                      type: isBranch ? "folder" : "file",
                      path: element.id as string,
                    },
                  })
                }
                handleDelete={() =>
                  dispatch({
                    type: IFileExplorerActionKind.DELETE,
                    payload: {
                      type: isBranch ? "folder" : "file",
                      path: element.id as string,
                    },
                  })
                }
                handleNewFile={() =>
                  dispatch({
                    type: IFileExplorerActionKind.ADD,
                    payload: {
                      type: "file",
                      path: element.id as string,
                    },
                  })
                }
                handleNewFolder={() =>
                  dispatch({
                    type: IFileExplorerActionKind.ADD,
                    payload: {
                      type: "folder",
                      path: element.id as string,
                    },
                  })
                }
              />
              {state.showAdd && state.path === element.id ? (
                <input
                  ref={(ref) => {
                    setTimeout(() => {
                      ref?.focus();
                    }, 200);
                  }}
                  className="ml-8"
                  onBlur={() =>
                    dispatch({ type: IFileExplorerActionKind.CLOSE_MODAL })
                  }
                  onKeyDown={async (e) => {
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
    </>
  );
};

export type Element = INode<IFlatMetadata>;

const NodeRenderer = ({
  isBranch,
  isExpanded,
  element,
  handleRename,
  handleDelete,
  handleNewFile,
  handleNewFolder,
}: {
  isBranch: boolean;
  isExpanded: boolean;
  element: Element;
  handleRename: () => void;
  handleDelete: () => void;
  handleNewFile: () => void;
  handleNewFolder: () => void;
}) => {
  const { name } = element;

  const handleClick = (action: IAction) => {
    switch (action) {
      case IAction.DELETE:
        handleDelete();
        break;
      case IAction.RENAME:
        handleRename();
        break;
      case IAction.NEW_FILE:
        handleNewFile();
        break;
      case IAction.NEW_FOLDER:
        handleNewFolder();
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
