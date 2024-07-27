"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { useCliCommands } from "./workspace/use-cli-commands";
import useSWR from "swr";
import { useParams } from "next/navigation";
import { db } from "@/data/db";

export function BuildDeployPanel() {
  const commands = useCliCommands();
  const [isBuilding, setIsBuilding] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);

  const { id } = useParams<{ id: string }>();
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
            setIsDeploying(false);
            setIsBuilding(true);
            await commands.build();
          } catch (err) {
          } finally {
            setIsBuilding(false);
          }
        }}
      >
        Build
      </Button>
      <Button
        disabled={isBuilding || !isDeployable || isDeploying}
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
