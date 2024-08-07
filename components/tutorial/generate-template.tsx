"use client";

import { Button } from "@/components/ui/button";
import { db } from "@/data/db";
import { usePathname } from "next/navigation";
import { mutate } from "swr";

export default function GenerateTemplate({
  name = "HelloWorld",
  template = "aelf",
}: {
  name?: string;
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
      const res = await fetch(
        `/api/get-template-data?id=${template}&name=${name}`
      );
      const templateData: { path: string; contents: string }[] =
        await res.json();

      await db.files.bulkDelete(
        (await db.files.toArray())
          .map((i) => i.path)
          .filter((i) => i.startsWith(pathname))
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
