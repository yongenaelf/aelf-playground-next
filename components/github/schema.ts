import { z } from "zod";

export const getRepoInfoSchema = z.object({ default_branch: z.string() });

export const getRepoBranchesSchema = z.array(z.string());

export const getRepoBlobSchema = z.object({ content: z.string() });

export const getRepoTreeSchema = z.array(
  z.object({
    path: z.string().optional(),
    mode: z.string().optional(),
    type: z.string().optional(),
    sha: z.string().optional(),
    size: z.number().optional(),
    url: z.string().optional(),
  })
);

export const getRepoBlobsSchema = z.array(
  z.object({ path: z.string(), contents: z.string() })
);
