"use client";

import { useEffect, useRef } from "react";
import { ITheme, Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { FitAddon } from "@xterm/addon-fit";
import { WebContainer } from "@webcontainer/api";
import { useWebContainer } from "./use-web-container";
import { useTheme } from "next-themes";
import { useLoadFiles } from "./use-load-files";

async function startShell(
  terminal: Terminal,
  webcontainerInstance: WebContainer
) {
  const shellProcess = await webcontainerInstance.spawn("jsh", {
    terminal: {
      cols: terminal.cols,
      rows: terminal.rows,
    },
  });
  shellProcess.output.pipeTo(
    new WritableStream({
      write(data) {
        terminal.write(data);
      },
    })
  );
  const input = shellProcess.input.getWriter();
  terminal.onData((data) => {
    input.write(data);
  });

  window.addEventListener("resize", () => {
    shellProcess.resize({
      cols: terminal.cols,
      rows: terminal.rows,
    });
  });

  return shellProcess;
}

export function NodeTerminal() {
  const terminalElRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<Terminal>();
  const webContainer = useWebContainer();
  const { resolvedTheme } = useTheme();
  const loadFiles = useLoadFiles();

  useEffect(() => {
    if (!!terminalElRef.current && !terminalRef.current && !!webContainer) {
      const fitAddon = new FitAddon();
      const terminal = new Terminal({
        convertEol: true,
      });
      terminalRef.current = terminal;
      terminal.loadAddon(fitAddon);
      terminal.open(terminalElRef.current);
      fitAddon.fit();

      window.addEventListener("resize", () => {
        fitAddon.fit();
      });

      startShell(terminal, webContainer);
    }
  }, [terminalElRef.current, terminalRef, webContainer]);

  useEffect(() => {
    const terminal = terminalRef.current;
    const isLightMode = resolvedTheme === "light";
    const lightTheme: ITheme = {
      foreground: "black",
      background: "white",
      cursor: "black",
      cursorAccent: "black",
      selectionBackground: "grey",
      selectionForeground: "white",
      selectionInactiveBackground: "grey",
    };
    if (terminal) {
      terminal.options.theme = isLightMode ? lightTheme : undefined;
    }
  }, [resolvedTheme, terminalRef]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  return <div ref={terminalElRef} className="p-2"></div>;
}

export default NodeTerminal;