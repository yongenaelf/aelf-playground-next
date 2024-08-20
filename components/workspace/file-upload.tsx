"use client";

import { db, FileContent } from "@/data/db";
import { useCallback } from "react";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import { kebabCase } from "es-toolkit/string";
import { useRouter } from "next/navigation";

export function FileUpload() {
  const router = useRouter();
  const onDrop = useCallback<NonNullable<DropzoneOptions["onDrop"]>>(
    async (acceptedFiles) => {
      let all: FileContent[] = [];

      acceptedFiles.forEach((file) => {
        const reader = new FileReader();

        reader.onabort = () => console.log("file reading was aborted");
        reader.onerror = () => console.log("file reading has failed");
        reader.onload = () => {
          // Do whatever you want with the file contents
          const binaryStr = reader.result;
          if (binaryStr instanceof ArrayBuffer) {
            const contents = Buffer.from(binaryStr).toString("ascii");
            // @ts-expect-error
            const filename = file.path!;

            all.push({ path: filename.slice(1), contents });
          }
        };
        reader.readAsArrayBuffer(file);
      });

      const input = window.prompt("Enter the workspace name: ");

      if (!!input) {
        const name = kebabCase(input);

        try {
          await db.workspaces.add({
            name,
            template: "file-upload",
            dll: "",
          });

          const templateData: { path: string; contents: string }[] = all;

          await db.files.bulkAdd(
            templateData.map(({ path, contents }) => ({
              path: `/workspace/${name}/${encodeURIComponent(path)}`,
              contents,
            }))
          );
          await router.push(`/workspace/${name}`);
        } catch (err) {
          alert(String(err));
        }
      }
    },
    [router]
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="p-8 border">
      <input {...getInputProps()} />
      <p>Drag &apos;n&apos; drop some files here, or click to select files</p>
    </div>
  );
}
