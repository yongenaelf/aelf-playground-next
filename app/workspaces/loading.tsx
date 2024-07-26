import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container grid grid-cols-1 gap-8 px-4 py-12 md:grid-cols-3 md:gap-12 md:px-6 lg:py-16">
      <div>
        <h1 className="text-2xl mb-2">Create a new workspace</h1>
        <Skeleton className="h-4 w-12 mt-3" />
        <Skeleton className="h-8 w-full mt-3" />
      </div>
      <div className="md:col-span-2">
        <h1 className="text-2xl mb-2">Open an existing workspace</h1>
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    </div>
  );
}
