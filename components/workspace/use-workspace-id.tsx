"use client";
import { useParams, usePathname } from "next/navigation";

export function useWorkspaceId() {
  const pathname = usePathname();
  const { id: workspaceId } = useParams<{ id: string }>();
  const id = pathname.startsWith("/workspace") ? workspaceId : pathname;

  return id;
}
