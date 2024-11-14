import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import { rehypeGithubAlerts } from "rehype-github-alerts";
import GenerateTemplate from "@/components/tutorial/generate-template";
import GenerateTemplateSolidity from "@/components/tutorial/generate-template-solidity";
import "./page.scss";

export default async function Page(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;

  const {
    id
  } = params;

  let res = { default: "" };
  try {
    res = await import("./_content/" + id + "/" + id + ".mdx");
  } catch (err) {
    res.default = "Error loading tutorial.";
  }
  const markdown = res.default;
  return (
    <div className="m-4 mdx-content">
      <MDXRemote
        source={markdown}
        components={{ GenerateTemplate, GenerateTemplateSolidity }}
        options={{
          mdxOptions: {
            rehypePlugins: [[rehypePrettyCode], [rehypeGithubAlerts]],
          },
        }}
      />
    </div>
  );
}
