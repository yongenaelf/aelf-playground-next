"use client";
import Dexie, { type EntityTable } from "dexie";

interface File {
  path: string;
  contents: string;
}

const db = new Dexie("FileDatabase") as Dexie & {
  files: EntityTable<File, "path">;
};

// Schema declaration:
db.version(1).stores({
  files: "path, contents",
});

export type { File as FileContent };
export { db };
