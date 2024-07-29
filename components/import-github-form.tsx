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
import { useRouter, useParams } from "next/navigation";
import { db } from "@/data/db";
import { Loader2 } from "lucide-react";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  template: z.string(),
});

export function ImportGitHubForm(props: {
  data: { path: string; contents: string }[];
}) {
  const { path, user, repo, branch } = useParams<{
    path: string[];
    user: string;
    repo: string;
    branch: string;
  }>();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      template: `github.com/${user}/${repo}/tree/${branch}/${path.join("/")}`,
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

      await db.files.bulkAdd(
        props.data.map(({ path, contents }) => ({
          path: `/workspace/${data.name}/${encodeURIComponent(path)}`,
          contents,
        }))
      );
      await router.push(`/workspace/${data.name}`);
    } catch (err) {
      form.setError("name", { message: String(err) });
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
        <FormField
          control={form.control}
          name="template"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repo</FormLabel>
              <FormControl>
                <Input
                  className="w-full"
                  placeholder="workspace-name"
                  {...field}
                  disabled
                />
              </FormControl>
              <FormDescription>This is the source repo.</FormDescription>
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
