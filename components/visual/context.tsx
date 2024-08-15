"use client";

import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface IMethods {
  name: string;
  type: string;
}

interface IViewMethods extends IMethods {
  outputType: string;
}

interface IVisualEditorState {
  name: string;
  viewMethods: IViewMethods[];
  sendMethods: IMethods[];
}

const defaultState: IVisualEditorState = {
  name: "Hello World",
  viewMethods: [],
  sendMethods: [],
};

const VisualEditorContext = createContext<{
  state: IVisualEditorState;
  setState: Dispatch<SetStateAction<IVisualEditorState>>;
}>({ state: defaultState, setState: () => {} });

const VisualEditorProvider = ({ children }: PropsWithChildren) => {
  const [state, setState] = useState<IVisualEditorState>(defaultState);

  return (
    <VisualEditorContext.Provider value={{ state, setState }}>
      {children}
    </VisualEditorContext.Provider>
  );
};

const useVisualEditorContext = () => {
  return useContext(VisualEditorContext);
};

export { VisualEditorProvider, useVisualEditorContext };
