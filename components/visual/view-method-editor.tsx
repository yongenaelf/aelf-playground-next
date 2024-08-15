"use client";

import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InputOutputOptions } from "./input-output-options";
import clsx from "clsx";

const schema = z.object({
  method: z.array(
    z.object({
      name: z
        .string({ required_error: "Name is required." })
        .trim()
        .min(1, "Name is required."),
      type: z.string(),
      outputType: z.string(),
    })
  ),
});

type FormValues = z.infer<typeof schema>;

export function ViewMethodEditor({
  value = [],
  onChange,
}: {
  value?: FormValues["method"];
  onChange?: (val: FormValues["method"]) => void;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      method: value,
    },
    mode: "onBlur",
  });
  const { control } = form;

  const { fields, append, remove } = useFieldArray({
    name: "method",
    control,
  });

  const { method } = useWatch({ control });

  useEffect(() => {
    try {
      const value = schema.parse({ method });
      if (!!onChange) onChange(value?.method || []);
    } catch (err) {
      // console.log(err);
    }
  }, [method]);

  return (
    <Form {...form}>
      {fields.map((field, index) => {
        return (
          <section key={field.id} className="flex gap-2">
            <FormField
              control={control}
              name={`method.${index}.name`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  {index === 0 ? <FormLabel>Name</FormLabel> : null}
                  <FormControl>
                    <Input placeholder="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`method.${index}.type`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  {index === 0 ? <FormLabel>Input</FormLabel> : null}
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an input type" />
                      </SelectTrigger>
                      <InputOutputOptions />
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`method.${index}.outputType`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  {index === 0 ? <FormLabel>Output</FormLabel> : null}
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an output type" />
                      </SelectTrigger>
                      <InputOutputOptions />
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="ghost"
              onClick={() => remove(index)}
              className={clsx({ "mt-8": index === 0 })}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </section>
        );
      })}

      <Button
        variant="ghost"
        type="button"
        onClick={() =>
          append({
            name: "test",
            type: "empty",
            outputType: "empty",
          })
        }
      >
        <Plus className="w-4 h-4" />
      </Button>
    </Form>
  );
}
