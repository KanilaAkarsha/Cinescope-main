"use client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { XIcon } from "lucide-react";
import { useCallback } from "react";
import { getAllGenres } from "@/lib/data";
import { getAllLanguages, getAllYears } from "@/lib/utils";

const LANGUAGES = [
  { value: "all", label: "All Languages" },
  ...getAllLanguages().map((l) => ({
    value: l.toLowerCase(),
    label: l,
  })),
];

const GENRES = [
  { value: "all", label: "All Genres" }, // ← this was missing
  ...getAllGenres().map((g) => ({
    value: g.toLowerCase(),
    label: g,
  })),
];

const YEARS = [
  { value: "all", label: "All Years" },
  ...getAllYears().map((y) => ({
    value: y,
    label: y,
  })),
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "title_asc", label: "Title A–Z" },
  { value: "title_desc", label: "Title Z–A" },
  { value: "rating_desc", label: "Highest Rated" },
  { value: "rating_asc", label: "Lowest Rated" },
];

export default function MovieFilters({ onClose }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const currentStatus = searchParams.get("status") || "all";
  const currentGenre = searchParams.get("genre") || "all";
  const currentYear = searchParams.get("year") || "all";
  const currentSort = searchParams.get("sort") || "";

  const updateParam = useCallback(
    (key, value) => {
      const params = new URLSearchParams(searchParams.toString());
      if (!value || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      // Reset to page 1 on filter change
      params.delete("page");
      replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, replace],
  );

  const clearAllFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    ["status", "genre", "year", "sort", "page"].forEach((key) =>
      params.delete(key),
    );
    replace(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, replace]);

  const hasActiveFilters = [
    searchParams.get("status"),
    searchParams.get("genre"),
    searchParams.get("year"),
    searchParams.get("sort"),
  ].some(Boolean);

  return (
    <div className=" rounded-lg border bg-card p-4 shadow-sm mb-6 ">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">Filter & Sort</h3>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-muted-foreground hover:text-foreground"
              onClick={clearAllFilters}>
              Clear all
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onClose}>
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* language */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Language
          </label>
          <Select
            value={currentStatus}
            onValueChange={(val) => updateParam("status", val)}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Genre */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Genre
          </label>
          <Select
            value={currentGenre}
            onValueChange={(val) => updateParam("genre", val)}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent>
              {GENRES.map((g) => (
                <SelectItem key={g.value} value={g.value}>
                  {g.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Year */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Year
          </label>
          <Select
            value={currentYear}
            onValueChange={(val) => updateParam("year", val)}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {YEARS.map((y) => (
                <SelectItem key={y.value} value={y.value}>
                  {y.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Sort By
          </label>
          <Select
            value={currentSort}
            onValueChange={(val) => updateParam("sort", val)}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active filter pills */}
      {hasActiveFilters && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {searchParams.get("status") && (
            <FilterPill
              label={`Status: ${searchParams.get("status")}`}
              onRemove={() => updateParam("status", "all")}
            />
          )}
          {searchParams.get("genre") && (
            <FilterPill
              label={`Genre: ${searchParams.get("genre")}`}
              onRemove={() => updateParam("genre", "all")}
            />
          )}
          {searchParams.get("year") && (
            <FilterPill
              label={`Year: ${searchParams.get("year")}`}
              onRemove={() => updateParam("year", "all")}
            />
          )}
          {searchParams.get("sort") && (
            <FilterPill
              label={`Sort: ${SORT_OPTIONS.find((s) => s.value === searchParams.get("sort"))?.label}`}
              onRemove={() => updateParam("sort", "")}
            />
          )}
        </div>
      )}
    </div>
  );
}

function FilterPill({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border bg-muted px-2.5 py-0.5 text-xs font-medium">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="ml-0.5 rounded-full hover:text-destructive transition-colors">
        <XIcon className="h-3 w-3" />
      </button>
    </span>
  );
}
