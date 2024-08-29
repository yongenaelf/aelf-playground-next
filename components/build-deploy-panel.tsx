"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { useCliCommands } from "./workspace/use-cli-commands";
import useSWR, { mutate } from "swr";
import { db } from "@/data/db";
import { useWorkspaceId } from "./workspace/use-workspace-id";
import { Download, Rocket, ShieldCheck, Wrench } from "lucide-react";

export function BuildDeployPanel() {
  const commands = useCliCommands();
  const [isAuditing, setIsAuditing] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const id = useWorkspaceId();

  const { data: isDeployable } = useSWR(
    id ? `deployable-${id}` : undefined,
    async () => {
      const ws = await db.workspaces.get(id);
      return typeof ws?.dll === "string";
    }
  );

  const buttons: Array<{
    disabled: boolean;
    title: string;
    onClick: () => void;
    icon: React.FunctionComponent<{ className?: string }>;
  }> = [
    {
      disabled: isAuditing,
      title: "AI Audit",
      onClick: async () => {
        setIsAuditing(true);
        try {
          await commands.audit();
        } catch (err) {
          console.log(err);
        } finally {
          setIsAuditing(false);
        }
      },
      icon: ShieldCheck,
    },
    {
      disabled: isBuilding,
      title: "Build",
      onClick: async () => {
        try {
          setIsBuilding(true);
          await commands.build();
          mutate(`deployable-${id}`);
        } catch (err) {
        } finally {
          setIsBuilding(false);
        }
      },
      icon: Wrench,
    },
    {
      disabled: isBuilding || !isDeployable || isDeploying,
      title: "Deploy",
      onClick: async () => {
        try {
          setIsDeploying(true);
          await commands.deploy();
        } catch (err) {
        } finally {
          setIsDeploying(false);
        }
      },
      icon: Rocket,
    },
    {
      disabled: false,
      title: "Export",
      onClick: async () => {
        try {
          await commands.export();
        } catch (err) {}
      },
      icon: Download,
    },
  ];

  return (
    <div className="p-4 border-b-2 flex gap-2">
      {buttons.map((button) => (
        <Button
          key={button.title}
          disabled={button.disabled}
          title={button.title}
          variant="ghost"
          className="rounded-none p-2"
          onClick={button.onClick}
        >
          <button.icon className="w-4 h-4" />
        </Button>
      ))}
    </div>
  );
}
