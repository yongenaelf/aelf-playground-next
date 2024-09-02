"use client";

import { useReducer } from "react";

// An enum with all the types of actions to use in our reducer
export enum IFileExplorerActionKind {
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

export const initialState: IFileExplorerState = {
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

export const useFileExplorerReducer = () => {
  return useReducer(reducer, initialState);
};
