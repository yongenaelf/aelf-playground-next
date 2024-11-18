"use client";

import React, { useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { csharp } from "@replit/codemirror-lang-csharp";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";
import { useTheme } from "@/components/providers/theme-provider";
import { StreamLanguage } from "@codemirror/language";
import { protobuf } from "@codemirror/legacy-modes/mode/protobuf";
import { getLang, Languages } from "./editor-enum";
import { xml } from "@codemirror/legacy-modes/mode/xml";
import { useSearchParams } from "react-router-dom";
import { usePathname } from "@/lib/use-pathname";
import { db } from "@/data/db";
import useSWR from "swr";
import { solidity } from "@replit/codemirror-lang-solidity";
import { javascript } from "@codemirror/lang-javascript";
import { css } from "@codemirror/lang-css";
import { markdown } from "@codemirror/lang-markdown";
import { json } from "@codemirror/lang-json";
import { html } from "@codemirror/lang-html";
import { useLinter } from "./use-linter";

export default function Editor() {
  const path = usePathname();
  const [params] = useSearchParams();
  const file = params.get("file");
  const pathname = `${path}/${file}`;
  const linter = useLinter();

  const { resolvedTheme } = useTheme();

  const editorTheme = resolvedTheme === "light" ? githubLight : githubDark;

  const { data: value } = useSWR(
    `editor-${pathname}`,
    async () => (await db.files.get(pathname))?.contents
  );

  const lang = getLang(pathname);

  const extensions = useMemo(() => {
    switch (lang) {
      case Languages.CSHARP:
        return Array.from([csharp(), linter].filter((i) => !!i));
      case Languages.PROTOBUF:
        return Array.from([StreamLanguage.define(protobuf)]);
      case Languages.XML:
        return Array.from([StreamLanguage.define(xml)]);
      case Languages.SOLIDITY:
        return Array.from([solidity]);
      case Languages.JAVASCRIPT:
        return Array.from([javascript({ jsx: pathname.endsWith(".jsx") })]);
      case Languages.TYPESCRIPT:
        return Array.from([
          javascript({ jsx: pathname.endsWith(".jsx"), typescript: true }),
        ]);
      case Languages.CSS:
        return Array.from([css()]);
      case Languages.MARKDOWN:
        return Array.from([markdown()]);
      case Languages.JSON:
        return Array.from([json()]);
      case Languages.HTML:
        return Array.from([html()]);
      default:
        return Array.from([]);
    }
  }, [lang, linter]);

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
