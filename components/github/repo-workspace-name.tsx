"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { db } from "@/data/db";
import { Loader2 } from "lucide-react";
import { getRepoBlobsSchema } from "./schema";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  template: z.string(),
});

function formatError(err: unknown) {
  const strErr = String(err);

  if (strErr.includes("Key already exists in the object store")) {
    return "This workspace name already in use.";
  }

  return strErr;
}

export function RepoWorkspaceName({
  repo,
  branch,
  paths,
}: {
  repo: string;
  branch: string;
  paths: string[];
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: paths.find(i => i.endsWith(".csproj"))?.split("/").pop()?.replace(".csproj", ""),
      template: `github.com/${repo}/tree/${branch}`,
    },
  });

  const router = useRouter();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    form.clearErrors();
    try {
      await db.workspaces.add({
        name: data.name,
        template: data.template,
        dll: "",
      });

      const [owner, repoName] = repo.split("/");

      const params = new URLSearchParams();

      params.set("owner", owner);
      params.set("repo", repoName);
      params.set("branch", branch);
      paths.forEach((path) => params.append("path", path));

      const filesRes = await fetch(`/api/get-repo-blobs?${params.toString()}`);
      const fileData = await filesRes.json();

      const parsedData = getRepoBlobsSchema.parse(fileData);

      const rootPath = parsedData.find(i => i.path.endsWith(".csproj"))?.path.split("/").slice(0, -2).join("/")

      await db.files.bulkAdd(
        parsedData.map(({ path, contents }) => ({
          path: `/workspace/${data.name}/${encodeURIComponent(rootPath ? path.replace(rootPath + "/", "") : path)}`,
          contents,
        }))
      );
      await router.push(`/workspace/${data.name}`);
    } catch (err) {
      form.setError("name", { message: formatError(err) });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  className="w-full"
                  placeholder="workspace-name"
                  {...field}
                />
              </FormControl>
              <FormDescription>This is your workspace name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </Form>
  );
}
