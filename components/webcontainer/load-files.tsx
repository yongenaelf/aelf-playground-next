"use client";

import { useEffect } from "react";
import { useLoadFiles } from "./use-load-files";

export function LoadFiles() {
  const loadFiles = useLoadFiles();

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  return null;
}
