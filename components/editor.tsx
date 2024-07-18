"use client";

import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { csharp } from "@replit/codemirror-lang-csharp";

export default function Editor() {
  const [value, setValue] = React.useState(`using System;
namespace Test
{
  class Program
  {
    public static void Main(string[] args)
    {
      Console.WriteLine("Hello, world!");
    }
  }
}`);
  const onChange = React.useCallback((val: string, viewUpdate: any) => {
    console.log("val:", val);
    setValue(val);
  }, []);
  return (
    <CodeMirror
      value={value}
      height="1000px"
      extensions={[csharp()]}
      onChange={onChange}
    />
  );
}
