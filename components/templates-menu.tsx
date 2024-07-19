import * as React from "react";
import { unstable_noStore as noStore } from "next/cache";

import { MenubarRadioGroup, MenubarRadioItem } from "@/components/ui/menubar";

async function getData() {
  noStore();

  const res = await fetch(
    `${process.env.BUILD_SERVER_BASE_URL}/playground/templates`
  );
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
