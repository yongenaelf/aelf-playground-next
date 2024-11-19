"use client";

import { Button } from "@/components/ui/button";
import { db } from "@/data/db";
import { usePathname } from "@/lib/use-pathname";
import { mutate } from "swr";
import { deleteExistingWorkspace, doesWorkspaceExist } from "./generate-template";
import { useEffect } from "react";

export default function GenerateTemplateSolidity({
  template = "solidity",
}: {
  template?: string;
}) {
  const pathname = usePathname();

  const onClick = async () => {
    const exists = await doesWorkspaceExist(pathname);

    if (exists) {
      const response = window.confirm("This will reset the files, are you sure?");

      if (!response) return;
    }

    try {
      await deleteExistingWorkspace(pathname);
      await generateTemplateFiles(pathname, template);
      await mutate(`file-explorer-${pathname}`);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    init(pathname, template);
  }, [pathname, template]);

  return <Button onClick={onClick}>Generate Template</Button>;
}

async function init(pathname: string, template: string) {
  const exists = await doesWorkspaceExist(pathname);
  if (!exists) {
    await generateTemplateFiles(pathname, template);
    await mutate(`file-explorer-${pathname}`);
  }
}

async function generateTemplateFiles(pathname: string, template: string) {
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

  await db.files.bulkAdd(
    templateData.map(({ path, contents }) => ({
      path: `${pathname}/${path}`,
      contents,
    }))
  );
}