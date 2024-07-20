"use client";

import * as React from "react";

import { MenubarItem } from "@/components/ui/menubar";
import Link from "next/link";

export function TemplateMenuItem({ children }: React.PropsWithChildren) {
  return (
    <MenubarItem>
      <Link href={`/template/${children}`} className="w-full">
        {children}
      </Link>
    </MenubarItem>
  );
}
