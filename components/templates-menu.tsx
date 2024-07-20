import * as React from "react";

import { getBuildServerBaseUrl } from "@/lib/env";
import { TemplateMenuItem } from "@/components/template-menu-item";

async function getData() {
  const res = await fetch(`${getBuildServerBaseUrl()}/playground/templates`);
  const data = await res.json();

  return data as string[];
}

export async function TemplatesMenu() {
  const data = await getData();

  return (
    <>
      {data.map((i) => (
        <TemplateMenuItem key={i}>{i}</TemplateMenuItem>
      ))}
    </>
  );
}
