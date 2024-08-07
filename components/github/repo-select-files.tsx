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
import { Loader2 } from "lucide-react";
import FileSelection from "./file-selection";

const FormSchema = z.object({
  paths: z.array(z.string()).min(1, "At least 1 file should be selected!"),
});

export function RepoSelectFiles({
  repo,
  branch,
  onSubmit: _onSubmit,
}: {
  repo?: string;
  branch?: string;
  onSubmit?: (val: string[]) => Promise<void>;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      paths: [],
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    form.clearErrors();
    if (!!_onSubmit) {
      await _onSubmit(data.paths);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex">
        <FormField
          control={form.control}
          name="paths"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select files</FormLabel>
              <FormControl>
                <FileSelection
                  ownerrepo={repo}
                  branch={branch}
                  onSelect={({ treeState }) =>
                    field.onChange(Array.from(treeState.selectedIds))
                  }
                />
              </FormControl>
              <FormDescription>Choose files to import</FormDescription>
              <FormMessage />
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Choose files"
                )}
              </Button>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
