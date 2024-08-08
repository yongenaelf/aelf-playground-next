import { octokit } from "@/components/github/octokit";
import { getRepoTreeSchema } from "@/components/github/schema";

import { z } from "zod";

const requestSchema = z.object({
  owner: z.string(),
  repo: z.string(),
  branch: z.string(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const { owner, repo, branch } = requestSchema.parse({
    owner: searchParams.get("owner"),
    repo: searchParams.get("repo"),
    branch: searchParams.get("branch"),
  });

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

  const parsed = getRepoTreeSchema.parse(tree);

  return Response.json(parsed);
}
