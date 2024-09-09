"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect } from "react";

const FormSchema = z.object({
  items: z.array(z.string()),
});

export function Filter({
  searchKey,
  title,
  options,
}: {
  searchKey: string;
  title: string;
  options: { id: string; label: string }[];
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: searchParams.getAll(searchKey),
    },
  });

  const { items } = useWatch({ control: form.control });

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (values?: string[]) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(searchKey);
      values?.forEach((value) => {
        params.append(searchKey, value);
      });

      const res = params.toString();

      if (res) return "?" + res;

      return "";
    },
    [searchParams, searchKey]
  );

  useEffect(() => {
    router.push(pathname + createQueryString(items));
  }, [items]);

  return (
    <Form {...form}>
      <form className="space-y-8">
        <FormField
          control={form.control}
          name="items"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">{title}</FormLabel>
              </div>
              {options.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="items"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item.id
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
