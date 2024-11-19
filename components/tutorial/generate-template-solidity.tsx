"use client";

import { Button } from "@/components/ui/button";
import { db } from "@/data/db";
import { usePathname } from "@/lib/use-pathname";
import { mutate } from "swr";

export default function GenerateTemplateSolidity({
  template = "solidity",
}: {
  template?: string;
}) {
  const pathname = usePathname();

  const onClick = async () => {
    const response = window.confirm("This will reset the files, are you sure?");

    if (!response) return;

    try {
      await db.workspaces.delete(pathname);
      await db.workspaces.add({
        name: pathname,
        template,
        dll: "",
      });

      const templateData: { path: string; contents: string }[] = [
        {
          path: "src/HelloWorld.sol",
          contents: `// SPDX-License-Identifier: MIT
// compiler version must be greater than or equal to 0.8.24 and less than 0.9.0
pragma solidity ^0.8.24;

contract HelloWorld {
    string public greet = "Hello World!";
}
`,
        },
      ];

      await db.files.bulkDelete(
        (await db.files.toArray())
          .map((i) => i.path)
          .filter((i) => i.startsWith(pathname + "/"))
      );
      await db.files.bulkAdd(
        templateData.map(({ path, contents }) => ({
          path: `${pathname}/${path}`,
          contents,
        }))
      );
      await mutate(`file-explorer-${pathname}`);
    } catch (err) {
      console.log(err);
    }
  };

  return <Button onClick={onClick}>Generate Template</Button>;
}
