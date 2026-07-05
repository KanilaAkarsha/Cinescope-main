"use client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { SearchIcon, SlidersHorizontalIcon } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useDebounce } from "use-debounce";
import MovieFilters from "@/components/movie-filters";

export default function MovieSelectors() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { replace } = useRouter();

  const searchTerm = searchParams.get("query") || "";

  const [immediateSearchTerm, setImmediateSearchTerm] = useState(searchTerm);
  // const deferredSearchTerm = useDeferredValue(immediateSearchTerm);

  const isFirstRender = useRef(true);
  const [debouncedSearchTerm] = useDebounce(immediateSearchTerm, 1000);

  const activeFilterCount = [
    searchParams.get("status"),
    searchParams.get("genre"),
    searchParams.get("year"),
    searchParams.get("sort"),
  ].filter(Boolean).length;

  const currentStatus = searchParams.get("status") || "all";

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const newSearchParams = new URLSearchParams(searchParams.toString());

    debouncedSearchTerm
      ? newSearchParams.set("query", debouncedSearchTerm)
      : newSearchParams.delete("query");

    if (searchTerm !== debouncedSearchTerm) {
      replace(`${pathname}?${newSearchParams.toString()}`);
    }
  }, [pathname, debouncedSearchTerm, replace, searchParams, searchTerm]);

  const handleStatusChange = (value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("status");
    } else {
      params.set("status", value);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
        <div className="flex w-full items-center space-x-2 md:w-1/2">
          <SearchIcon className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search movies..."
            value={immediateSearchTerm}
            onChange={(e) => setImmediateSearchTerm(e.target.value)}
            className="h-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={currentStatus} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            className="h-9"
            onClick={() => setFiltersOpen(!filtersOpen)}>
            <SlidersHorizontalIcon className="mr-2 h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      <div>
        {/* Collapsible Filter Panel */}
        {filtersOpen && <MovieFilters onClose={() => setFiltersOpen(false)} />}
      </div>
    </div>
  );
}
