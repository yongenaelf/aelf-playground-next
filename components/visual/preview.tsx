"use client";

import CodeMirror from "@uiw/react-codemirror";
import { useVisualEditorContext } from "./context";
import { useTheme } from "next-themes";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";
import { StreamLanguage } from "@codemirror/language";
import { protobuf } from "@codemirror/legacy-modes/mode/protobuf";
import { useMemo } from "react";

const getType = (value: string) => {
  switch (value) {
    case "empty":
      return "google.protobuf.Empty";
    case "timestamp":
      return "google.protobuf.Timestamp";
  }

  return value;
};

export function Preview() {
  const { state } = useVisualEditorContext();
  const { theme, systemTheme } = useTheme();

  const currentTheme = theme !== "system" ? theme : systemTheme;
  const editorTheme = currentTheme === "light" ? githubLight : githubDark;

  const value = useMemo(() => {
    const name = state.name.split(" ").join("") || "HelloWorld";

    return `syntax = "proto3";

import "aelf/core.proto";
import "aelf/options.proto";
import "google/protobuf/empty.proto";
import "Protobuf/reference/acs12.proto";
import public "google/protobuf/timestamp.proto";

option csharp_namespace = "AElf.Contracts.${name}";

service ${name} {
  option (aelf.csharp_state) = "AElf.Contracts.${name}.${name}State";
  option (aelf.base) = "Protobuf/reference/acs12.proto";
  ${state.sendMethods
    .map(
      (i) => `
  rpc ${i.name}(${getType(i.type)}) returns (google.protobuf.Empty);`
    )
    .join("\n")}
  ${state.viewMethods
    .map(
      (i) => `
  rpc ${i.name} (${getType(i.type)}) returns (${getType(i.outputType)}) {
    option (aelf.is_view) = true;
  }`
    )
    .join("\n")}
}`;
  }, [state]);

  return (
    <CodeMirror
      value={value}
      theme={editorTheme}
      readOnly={true}
      editable={false}
      extensions={[StreamLanguage.define(protobuf)]}
    />
  );
}
