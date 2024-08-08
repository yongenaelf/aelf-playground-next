"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRepoBranch, useRepoInfo } from "./use-octokit";
import { useEffect, useMemo } from "react";

const FormSchema = z.object({
  branch: z.string({
    required_error: "Please select a branch.",
  }),
});

export function RepoBranchSelection({
  repo,
  onSubmit: _onSubmit,
}: {
  repo: string;
  onSubmit?: (val: { branch?: string }) => void;
}) {
  const { data } = useRepoBranch(repo);
  const { data: info } = useRepoInfo(repo);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    _onSubmit?.(data);
  }

  const branches = useMemo(() => {
    if (!data) return [];

    return data.map((i) => ({ label: i, value: i }));
  }, [data]);

  useEffect(() => {
    if (!!info) {
      form.setValue("branch", info.default_branch);
    }
  }, [info]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="branch"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Branches</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "justify-between w-fit min-w-96",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? branches.find(
                            (branch) => branch.value === field.value
                          )?.label
                        : "Select branch"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-fit">
                  <Command>
                    <CommandInput placeholder="Search branches..." />
                    <CommandList>
                      <CommandEmpty>No branch found.</CommandEmpty>
                      <CommandGroup>
                        {branches.map((branch) => (
                          <CommandItem
                            value={branch.label}
                            key={branch.value}
                            onSelect={() => {
                              form.setValue("branch", branch.value);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                branch.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {branch.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>Choose a branch.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Apply</Button>
      </form>
    </Form>
  );
}
