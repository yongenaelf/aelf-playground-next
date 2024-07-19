import * as React from "react";
import { unstable_noStore as noStore } from "next/cache";

import { MenubarRadioGroup, MenubarRadioItem } from "@/components/ui/menubar";

async function getData() {
  noStore();

  let url = `https://playground-next.test.aelf.dev/playground/templates`;
  if (process.env.NODE_ENV === "production") {
    url = `/playground/templates`;
  }

  const res = await fetch(url);
  const data = await res.json();

  return data as string[];
}

export async function TemplatesMenu() {
  const data = await getData();

  return (
    <MenubarRadioGroup>
      {data.map((i) => (
        <MenubarRadioItem key={i} value={i}>
          {i}
        </MenubarRadioItem>
      ))}
    </MenubarRadioGroup>
  );
}
