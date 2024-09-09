"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import gh from "parse-github-url";

const FormSchema = z.object({
  url: z.string().refine((arg) => {
    const { repo } = gh(arg) || {};

    return !!repo;
  }, "Is not a valid github url"),
});

export function RepoUrlForm({
  onSubmit: _onSubmit,
}: {
  onSubmit?: (val: { repo?: string; branch?: string }) => Promise<void>;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      url: "https://github.com/AElfProject/aelf-samples",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    form.clearErrors();
    if (!!_onSubmit) {
      const { repo, branch } = gh(data.url) || {};
      await _onSubmit({ repo: repo || undefined, branch: branch || undefined });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex mb-8">
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem className="flex-grow mr-3">
              <FormControl>
                <Input placeholder="workspace-name" {...field} />
              </FormControl>
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
            "Apply"
          )}
        </Button>
      </form>
    </Form>
  );
}
