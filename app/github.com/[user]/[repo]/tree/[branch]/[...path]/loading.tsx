import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container px-4 py-12 md:px-6 lg:py-16">
      <h1 className="text-2xl mb-2">Import GitHub repository</h1>
      <Skeleton className="h-5 w-20 mb-2 rounded-md bg-muted" />
      <Skeleton className="h-10 mb-2 w-full rounded-md bg-muted" />
      <Skeleton className="h-5 w-48 mb-8 rounded-md bg-muted" />
      <Skeleton className="h-5 w-20 mb-2 rounded-md bg-muted" />
      <Skeleton className="h-10 mb-2 w-full rounded-md bg-muted" />
      <Skeleton className="h-5 w-48 mb-8 rounded-md bg-muted" />
      <Skeleton className="h-10 w-20 mb-2 rounded-md bg-muted" />
    </div>
  );
}
