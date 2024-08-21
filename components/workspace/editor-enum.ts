export enum Languages {
  CSHARP = "csharp",
  PROTOBUF = "protobuf",
  XML = "xml",
  SOLIDITY = "sol",
  JAVASCRIPT = "js",
  CSS = "css",
  MARKDOWN = "md",
  JSON = "json",
  HTML = "html",
  TYPESCRIPT = "ts",
}

export function getLang(file: string) {
  if (file.endsWith("cs")) return Languages.CSHARP;
  if (file.endsWith("proto")) return Languages.PROTOBUF;
  if (file.endsWith("csproj")) return Languages.XML;
  if (file.endsWith("sol")) return Languages.SOLIDITY;
  if (file.endsWith("js") || file.endsWith("jsx")) return Languages.JAVASCRIPT;
  if (file.endsWith("ts") || file.endsWith("tsx")) return Languages.TYPESCRIPT;
  if (file.endsWith("css")) return Languages.CSS;
  if (file.endsWith("md")) return Languages.MARKDOWN;
  if (file.endsWith("json")) return Languages.JSON;
  if (file.endsWith("html")) return Languages.HTML;
}
