import { octokit } from "@/components/github/octokit";
import { getRepoBlobsSchema } from "@/components/github/schema";

import { z } from "zod";

const requestSchema = z.object({
  owner: z.string(),
  repo: z.string(),
  branch: z.string(),
  paths: z.array(z.string()),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const { owner, repo, branch, paths } = requestSchema.parse({
    owner: searchParams.get("owner"),
    repo: searchParams.get("repo"),
    branch: searchParams.get("branch"),
    paths: searchParams.getAll("path"),
  });

  const {
    data: { tree },
  } = await octokit.rest.git.getTree({
    owner,
    repo,
    tree_sha: branch,
    recursive: "true",
  });

  let response: { path: string; contents: string }[] = [];

  const files = tree
    .filter((i) => i.type === "blob")
    .filter((i) => (i.path ? paths.includes(i.path) : false));

  for (const file of files) {
    const {
      data: { content },
    } = await octokit.rest.git.getBlob({
      owner,
      repo,
      file_sha: file.sha!,
    });

    response.push({
      path: file.path!,
      contents: Buffer.from(content, "base64").toString("ascii"),
    });
  }

  const parsed = getRepoBlobsSchema.parse(response);

  return Response.json(parsed);
}
