"use client";

import React, { useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { csharp } from "@replit/codemirror-lang-csharp";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";
import { useTheme } from "next-themes";
import { StreamLanguage } from "@codemirror/language";
import { protobuf } from "@codemirror/legacy-modes/mode/protobuf";
import { getLang, Languages } from "./editor-enum";
import { xml } from "@codemirror/legacy-modes/mode/xml";
import { usePathname, useSearchParams } from "next/navigation";
import { db } from "@/data/db";
import useSWR from "swr";

export default function Editor() {
  const path = usePathname();
  const params = useSearchParams();
  const file = params.get("file");
  const pathname = `${path}/${file}`;

  const { theme, systemTheme } = useTheme();

  const currentTheme = theme !== "system" ? theme : systemTheme;
  const editorTheme = currentTheme === "light" ? githubLight : githubDark;

  const { data: value } = useSWR(
    `editor-${pathname}`,
    async () => (await db.files.get(pathname))?.contents
  );

  const lang = getLang(pathname);

  const extensions = useMemo(() => {
    switch (lang) {
      case Languages.CSHARP:
        return Array.from([csharp()]);
      case Languages.PROTOBUF:
        return Array.from([StreamLanguage.define(protobuf)]);
      case Languages.XML:
        return Array.from([StreamLanguage.define(xml)]);
      default:
        return Array.from([]);
    }
  }, [lang]);

  const onChange = React.useCallback(
    async (val: string, viewUpdate: any) => {
      await db.files.update(pathname, { contents: val });
    },
    [pathname]
  );

  return (
    <div className="h-full overflow-auto">
      <CodeMirror
        value={value}
        theme={editorTheme}
        extensions={extensions}
        onChange={onChange}
      />
    </div>
  );
}
