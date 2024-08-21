import { useCallback, useEffect } from "react";
import { useWebContainer } from "./use-web-container";
import { useWorkspaceId } from "../workspace/use-workspace-id";
import { usePathname } from "next/navigation";
import { db } from "@/data/db";
import { DirectoryNode, FileSystemTree } from "@webcontainer/api";

export function LoadFiles() {
  const id = useWorkspaceId();
  const pathname = usePathname();

  const webContainer = useWebContainer();

  const loadFiles = useCallback(async () => {
    if (typeof id !== "string") throw new Error("id is not string");
    const start = `${pathname}/`;
    const files = (
      await db.files.filter((file) => file.path.startsWith(start)).toArray()
    ).map((file) => ({
      path: decodeURIComponent(file.path.replace(start, "")),
      contents: file.contents,
    }));

    const root: FileSystemTree = {};

    files.forEach((file) => {
      const parts = file.path.split("/");
      let current = root;

      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          // Last part, assign file content under the "file" key
          current[part] = {
            file: {
              contents: file.contents,
            },
          };
        } else {
          // Traverse or create sub-directory under "directory" key
          if (!current[part]) {
            current[part] = {
              directory: {},
            };
          }
          current = (current[part] as DirectoryNode).directory;
        }
      });
    });

    if (!!webContainer) {
      webContainer.mount(root);
    }
  }, [id, pathname]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  return null;
}
