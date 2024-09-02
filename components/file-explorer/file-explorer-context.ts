"use client";

import { createContext, useContext } from "react";
import { initialState, useFileExplorerReducer } from "./file-explorer-reducer";

const FileExplorerContext = createContext<
  ReturnType<typeof useFileExplorerReducer>
>([initialState, () => {}]);

const useFileExplorerContext = () => {
  return useContext(FileExplorerContext);
};

export { FileExplorerContext, useFileExplorerContext };
