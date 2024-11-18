"use client";
import { useParams } from "react-router-dom";
import { usePathname } from "@/lib/use-pathname";

export function useWorkspaceId() {
  const pathname = usePathname();
  const { id: workspaceId } = useParams<{ id: string }>();
  const id = pathname.startsWith("/workspace") ? workspaceId : pathname;

  return id;
}
