import { useAuditReportSearchParam } from "@/data/audit";
import { linter, Diagnostic } from "@codemirror/lint";
import { useTheme } from "@/components/providers/theme-provider";
import { createHighlighter } from "shiki";
import { SearchCursor } from "@codemirror/search";

export const useLinter = () => {
  const { data } = useAuditReportSearchParam();
  const { resolvedTheme } = useTheme();

  if (!data) return null;

  return linter(async (view) => {
    const highlighter = await createHighlighter({
      themes: ["github-dark", "github-light"],
      langs: ["csharp"],
    });

    let diagnostics: Diagnostic[] = [];

    const newData = Object.entries(data).reduce((acc, [key, val]) => {
      acc[key] = val.map((v) => ({
        ...v,
        Detail: {
          ...(v.Detail || {}),
          Original: v.Detail?.Original.split("\n")[0].trim() || "",
          Updated: v.Detail?.Updated || "",
        },
      }));

      return acc;
    }, {} as typeof data);

    Object.values(newData).forEach((i) => {
      i.forEach((j) => {
        const { Original, Updated } = j.Detail || {};

        if (!!Original && !!Updated) {
          let cursor = new SearchCursor(view.state.doc, Original);
          cursor.next();

          const { from, to } = cursor.value;

          diagnostics.push({
            from,
            to,
            severity: "warning",
            source: "AI Audit",
            message: j.Description,
            renderMessage: (view) => {
              const div = document.createElement("span");

              div.classList.add("text-sm");

              div.innerHTML = `<p><b>Content</b>: ${
                j.Content
              }</p><p><b>Description</b>: ${
                j.Description
              }</p><div>${highlighter.codeToHtml(Updated, {
                lang: "csharp",
                theme:
                  resolvedTheme === "light" ? "github-light" : "github-dark",
              })}</div>`;

              return div;
            },
          });
        }
      });
    });

    return diagnostics;
  });
};
