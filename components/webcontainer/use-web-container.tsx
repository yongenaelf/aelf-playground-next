"use client";

import { useContext } from "react";
import { WebContainerContext } from "./provider";

export function useWebContainer() {
  const webContainer = useContext(WebContainerContext);

  return webContainer;
}
