"use client";

import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

import { DataTable as DataTableNew } from "@/components/shared/data-table/data-table";
import { withDndColumn } from "@/components/shared/data-table/table-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { useDebouncedValue } from "@/hooks/use-debounce";
import { api } from "@/trpc/react";

import { CreatePostDialog } from "../dialog/create-post-dialog";
import { postColumnsBase } from "./columns";

const PAGE_SIZE = 10;

export function PostTable() {
  const [{ page, q: qParam }, setQuery] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      q: parseAsString.withDefault(""),
    },
    {
      history: "push",
    },
  );

  const debouncedSearch = useDebouncedValue(qParam, 300);

  const { data, isLoading, isError, error } = api.post.list.useQuery(
    {
      page,
      limit: PAGE_SIZE,
      search: debouncedSearch,
    },
    {
      retry: false,
      staleTime: 0,
    },
  );

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const columns = withDndColumn(postColumnsBase);
  const table = useDataTableInstance({
    data: items,
    columns,
    getRowId: (row) => row.id,
  });

  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  if (isError) {
    return (
      <div className="@container/main flex flex-col gap-4 md:gap-6">
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
          <p className="font-semibold">Error loading posts</p>
          <p className="text-sm">{error.message}</p>
          <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>
            Reload page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="font-semibold text-xl">Posts</h1>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search posts..."
            className="h-8 w-40 md:w-56"
            value={qParam}
            onChange={(e) =>
              setQuery({
                q: e.target.value || null,
                page: 1,
              })
            }
          />
          <CreatePostDialog />
        </div>
      </div>

      <div className="space-y-4">
        <div className="overflow-hidden rounded-lg border">
          <DataTableNew dndEnabled table={table} columns={columns} />
        </div>

        <div className="flex items-center justify-between px-2 text-muted-foreground text-xs">
          <div className="hidden items-center gap-2 md:flex">
            <span className="font-medium">Rows per page</span>
            <span className="rounded border px-2 py-1">{PAGE_SIZE}</span>
          </div>
          <div className="flex flex-1 items-center justify-center gap-4 md:flex-none">
            <span className="hidden md:inline">
              Page {page} of {totalPages}
            </span>
            <span className="md:hidden">
              {page}/{totalPages}
            </span>
            <span className="hidden text-muted-foreground text-xs md:inline">· {total} posts</span>
          </div>
          <div className="ml-auto flex items-center gap-1 md:ml-0">
            <Button
              variant="outline"
              size="icon"
              className="hidden h-7 w-7 md:inline-flex"
              disabled={!canGoPrev}
              onClick={() => setQuery({ page: 1 })}
            >
              «
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              disabled={!canGoPrev}
              onClick={() => setQuery({ page: page - 1 })}
            >
              ‹
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
              const offset = Math.max(1, Math.min(page - 2, totalPages - 4));
              const p = offset + idx;
              if (p > totalPages) return null;
              return (
                <Button
                  key={p}
                  variant={p === page ? "default" : "outline"}
                  size="icon"
                  className="h-7 w-7 text-xs"
                  onClick={() => setQuery({ page: p })}
                >
                  {p}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              disabled={!canGoNext}
              onClick={() => setQuery({ page: page + 1 })}
            >
              ›
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="hidden h-7 w-7 md:inline-flex"
              disabled={!canGoNext}
              onClick={() => setQuery({ page: totalPages })}
            >
              »
            </Button>
          </div>
        </div>

        {isLoading && <p className="text-muted-foreground text-xs">Loading posts...</p>}
      </div>
    </div>
  );
}
