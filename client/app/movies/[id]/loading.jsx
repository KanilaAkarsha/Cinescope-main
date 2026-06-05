import { Skeleton } from "@/components/ui/skeleton";

export default function MovieDetailsLoading() {
  // Render  fallback UI
  return (
    <div className="w-full">
      <Skeleton className="aspect-21/4 w-full" />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:gap-8">
          <Skeleton className="h-[400px] w-[300px] rounded-lg" />
          <div className="mt-6 flex-1 space-y-4 md:mt-0">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="flex gap-2 py-2">
              <Skeleton className="h-8 w-16 rounded-full" />
              <Skeleton className="h-8 w-16 rounded-full" />
              <Skeleton className="h-8 w-16 rounded-full" />
            </div>
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}