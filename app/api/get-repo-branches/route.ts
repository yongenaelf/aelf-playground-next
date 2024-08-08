import { octokit } from "@/components/github/octokit";
import { getRepoBranchesSchema } from "@/components/github/schema";

import { z } from "zod";

const requestSchema = z.object({ owner: z.string(), repo: z.string() });

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const { owner, repo } = requestSchema.parse({
    owner: searchParams.get("owner"),
    repo: searchParams.get("repo"),
  });

  const { data } = await octokit.rest.repos.listBranches({ owner, repo });

  const parsed = getRepoBranchesSchema.parse(data.map((i) => i.name));

  return Response.json(parsed);
}
