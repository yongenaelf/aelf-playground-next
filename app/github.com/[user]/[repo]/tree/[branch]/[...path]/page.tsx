import { ImportGitHubForm } from "@/components/import-github-form";
import { Octokit } from "octokit";
import { throttling } from "@octokit/plugin-throttling";
import { getGitHubToken } from "@/lib/env";

interface Params {
  path: string[];
  user: string;
  repo: string;
  branch: string;
}

const MyOctokit = Octokit.plugin(throttling);

const getData = async ({ path, user, repo, branch }: Params) => {
  const octokit = new MyOctokit({
    auth: getGitHubToken(),
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
      onSecondaryRateLimit: (retryAfter, options, octokit) => {
        // does not retry, only logs a warning
        octokit.log.warn(
          `SecondaryRateLimit detected for request ${options.method} ${options.url}`
        );
      },
    },
  });

  const contents = await octokit.rest.repos.getContent({
    owner: user,
    repo,
    ref: `heads/${branch}`,
    path: path.join("/"),
  });

  const folder = contents.data;

  if (!Array.isArray(folder)) {
    return "Not a folder.";
  }

  const srcSha = folder?.find((i) => i.name === "src")?.sha;

  if (!srcSha) return "No src folder found.";

  const src = await octokit.rest.git.getTree({
    owner: user,
    repo,
    tree_sha: srcSha,
    recursive: "true",
  });

  const data = src.data.tree;

  let response: { path: string; contents: string }[] = [];

  if (Array.isArray(data)) {
    const files = data.filter((i) => i.type === "blob");

    for (const file of files) {
      const blob = await octokit.rest.git.getBlob({
        owner: user,
        repo,
        file_sha: file.sha!,
      });

      response.push({
        path: `src/${file.path!}`,
        contents: Buffer.from(blob.data.content, "base64").toString("ascii"),
      });
    }
  }

  return response;
};

export default async function Page(
  props: {
    params: Promise<Params>;
  }
) {
  const params = await props.params;

  const {
    path,
    user,
    repo,
    branch
  } = params;

  const data = await getData({ path, user, repo, branch });

  return (
    <div className="container px-4 py-12 md:px-6 lg:py-16">
      <h1 className="text-2xl mb-2">Import GitHub repository</h1>
      {typeof data === "string" ? data : <ImportGitHubForm data={data} />}
    </div>
  );
}
