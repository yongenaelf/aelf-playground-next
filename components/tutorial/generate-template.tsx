"use client";

import { Button } from "@/components/ui/button";
import { db } from "@/data/db";
import { playgroundService } from "@/data/playground-service";
import { usePathname } from "@/lib/use-pathname";
import { useEffect } from "react";
import { mutate } from "swr";

export default function GenerateTemplate({
  name = "HelloWorld",
  template = "aelf",
  renameHelloWorldProto = "hello_world_contract",
}: {
  name?: string;
  template?: string;
  renameHelloWorldProto?: string;
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
      await generateTemplateFiles(pathname, name, template, renameHelloWorldProto);
      await mutate(`file-explorer-${pathname}`);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    init(pathname, name, template, renameHelloWorldProto);
  }, [pathname, name, template, renameHelloWorldProto]);

  return <Button onClick={onClick}>Generate Template</Button>;
}

async function init(pathname: string, name: string, template: string, renameHelloWorldProto: string) {
  const exists = await doesWorkspaceExist(pathname);
  if (!exists) {
    await generateTemplateFiles(pathname, name, template, renameHelloWorldProto);
    await mutate(`file-explorer-${pathname}`);
  }
}


export async function doesWorkspaceExist(pathname: string) {
  const workspace = await db.workspaces.get(pathname);

  return !!workspace;
}

export async function deleteExistingWorkspace(pathname: string) {
  await db.workspaces.delete(pathname);
  await db.files.bulkDelete(
    (await db.files.toArray())
      .map((i) => i.path)
      .filter((i) => i.startsWith(pathname + "/"))
  );
}

async function generateTemplateFiles(pathname: string, name: string, template: string, renameHelloWorldProto: string) {
  await db.workspaces.add({
    name: pathname,
    template,
    dll: "",
  });

  const _templateData = await playgroundService.getTemplateData(
    template,
    name
  );

  const templateData = _templateData.map((i) => {
    if (i.path.includes("hello_world_contract.proto")) {
      return {
        ...i,
        path: i.path.replace(
          "hello_world_contract.proto",
          `${renameHelloWorldProto}.proto`
        ),
      };
    }

    return i;
  });

  await db.files.bulkAdd(
    templateData.map(({ path, contents }) => ({
      path: `${pathname}/${path}`,
      contents,
    }))
  );
}