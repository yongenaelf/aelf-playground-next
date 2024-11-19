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
import { usePathname } from "@/lib/use-pathname";
import { db } from "@/data/db";
import { Loader2 } from "lucide-react";
import { useRefreshFileExplorer } from "./";

const FormSchema = z.object({
  path: z.string(),
});

export function RenameForm({
  onSubmit,
  type,
  path,
}: {
  onSubmit?: (path: string) => void;
  type?: "file" | "folder";
  path?: string;
}) {
  const pathname = usePathname();
  const refreshFileExplorer = useRefreshFileExplorer();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      path,
    },
  });

  async function _onSubmit(data: z.infer<typeof FormSchema>) {
    form.clearErrors();

    if (!path) return;

    try {
      if (type === "file") {
        const currentKey = `${pathname}/${encodeURIComponent(path)}`;
        const currentFile = await db.files.get(currentKey);

        const newKey = `${pathname}/${encodeURIComponent(data.path)}`;
        await db.files.add({
          path: newKey,
          contents: currentFile?.contents || "",
        });
        await db.files.delete(currentKey);
      } else {
        const currentKey = `${pathname}/${encodeURIComponent(path)}`;
        const currentFiles = await db.files
          .filter((file) => file.path.startsWith(currentKey))
          .toArray();

        const newKey = `${pathname}/${encodeURIComponent(data.path)}`;
        const newFiles = currentFiles.map((i) => ({
          ...i,
          path: i.path.replace(currentKey, newKey),
        }));

        await db.files.bulkAdd(newFiles);
        await db.files.bulkDelete(currentFiles.map((i) => i.path));
      }

      await refreshFileExplorer();
      onSubmit?.(data.path);
    } catch (err) {
      form.setError("path", { message: "Path already exists." });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(_onSubmit)}
        className="w-full space-y-6"
      >
        <FormField
          control={form.control}
          name="path"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Path</FormLabel>
              <FormControl>
                <Input className="w-full" placeholder="path" {...field} />
              </FormControl>
              <FormDescription>
                This is the new path of your {type}.
              </FormDescription>
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
