import useSWR from "swr";
import { octokit } from "./octokit";

export function useRepoTree(ownerrepo?: string, branch?: string) {
  return useSWR(
    ownerrepo ? `repo-tree-${ownerrepo}-${branch}` : undefined,
    async () => {
      const [owner, repo] = ownerrepo!.split("/");

      const {
        data: { default_branch },
      } = await octokit.rest.repos.get({
        owner,
        repo,
      });
    
      const {
        data: { tree },
      } = await octokit.rest.git.getTree({
        owner,
        repo,
        tree_sha: branch || default_branch,
        recursive: "true",
      });

      return tree;
    }
  );
}

export function useRepoBranch(ownerrepo?: string) {
  return useSWR(
    ownerrepo ? `repo-branch-${ownerrepo}` : undefined,
    async () => {
      const [owner, repo] = ownerrepo!.split("/");

      const { data } = await octokit.rest.repos.listBranches({ owner, repo });

      return data.map((i) => i.name)
    }
  );
}

export function useRepoInfo(ownerrepo?: string) {
  return useSWR(ownerrepo ? `repo-info-${ownerrepo}` : undefined, async () => {
    const [owner, repo] = ownerrepo!.split("/");

    const { data } = await octokit.rest.repos.get({ owner, repo });

    return data;
  });
}
