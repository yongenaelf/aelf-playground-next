"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { useCliCommands } from "./workspace/use-cli-commands";
import useSWR, { mutate } from "swr";
import { db } from "@/data/db";
import { useWorkspaceId } from "./workspace/use-workspace-id";

export function BuildDeployPanel() {
  const commands = useCliCommands();
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

  return (
    <div className="p-4 border-b-2 flex gap-2">
      <Button
        disabled={isBuilding}
        onClick={async () => {
          try {
            setIsBuilding(true);
            await commands.build();
            mutate(`deployable-${id}`);
          } catch (err) {
          } finally {
            setIsBuilding(false);
          }
        }}
      >
        Build
      </Button>
      <Button
        disabled={!isDeployable || isDeploying}
        onClick={async () => {
          try {
            setIsDeploying(true);
            await commands.deploy();
          } catch (err) {
          } finally {
            setIsDeploying(false);
          }
        }}
      >
        Deploy
      </Button>
    </div>
  );
}
