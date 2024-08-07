"use client";
import { Octokit } from "octokit";
import { throttling } from "@octokit/plugin-throttling";
import useSWR from "swr";

const MyOctokit = Octokit.plugin(throttling);

const octokit = new MyOctokit({
  throttle: {
    onRateLimit: (retryAfter, options, octokit, retryCount) => {
      octokit.log.warn(
        `Request quota exhausted for request ${options.method} ${options.url}`
      );

      if (retryCount < 1) {
        // only retries once
        octokit.log.info(`Retrying after ${retryAfter} seconds!`);
        return true;
      }
    },
    onSecondaryRateLimit: (_retryAfter, options, octokit) => {
      // does not retry, only logs a warning
      octokit.log.warn(
        `SecondaryRateLimit detected for request ${options.method} ${options.url}`
      );
    },
  },
});

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

      return await octokit.rest.git.getTree({
        owner,
        repo,
        tree_sha: branch || default_branch,
        recursive: "true",
      });
    }
  );
}

export function useRepoBlob(ownerrepo?: string, sha?: string) {
  return useSWR(
    ownerrepo && sha ? `repo-blob-${ownerrepo}-${sha}` : undefined,
    async () => {
      const [owner, repo] = ownerrepo!.split("/");

      return await octokit.rest.git.getBlob({
        owner,
        repo,
        file_sha: sha!,
      });
    }
  );
}
