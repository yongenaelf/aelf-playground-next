"use client";
import useSWR from "swr";
import {
  getRepoBranchesSchema,
  getRepoInfoSchema,
  getRepoTreeSchema,
} from "./schema";

export function useRepoTree(ownerrepo?: string, branch?: string) {
  return useSWR(
    ownerrepo ? `repo-tree-${ownerrepo}-${branch}` : undefined,
    async () => {
      const [owner, repo] = ownerrepo!.split("/");

      const res = await fetch(
        `/api/get-repo-tree?owner=${owner}&repo=${repo}&branch=${branch}`
      );

      const data = await res.json();

      return getRepoTreeSchema.parse(data);
    }
  );
}

export function useRepoBranch(ownerrepo?: string) {
  return useSWR(
    ownerrepo ? `repo-branch-${ownerrepo}` : undefined,
    async () => {
      const [owner, repo] = ownerrepo!.split("/");

      const res = await fetch(
        `/api/get-repo-branches?owner=${owner}&repo=${repo}`
      );

      const data = await res.json();

      return getRepoBranchesSchema.parse(data);
    }
  );
}

export function useRepoInfo(ownerrepo?: string) {
  return useSWR(ownerrepo ? `repo-info-${ownerrepo}` : undefined, async () => {
    const [owner, repo] = ownerrepo!.split("/");

    const res = await fetch(`/api/get-repo-info?owner=${owner}&repo=${repo}`);

    const data = await res.json();

    return getRepoInfoSchema.parse(data);
  });
}
