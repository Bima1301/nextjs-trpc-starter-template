"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { DataTableColumnHeader } from "@/components/shared/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api, type RouterOutputs } from "@/trpc/react";

import { EditPostDialog } from "../dialog/edit-post-dialog";

export type PostRow = RouterOutputs["post"]["list"]["items"][number];

function ActionsCell({ post }: { post: PostRow }) {
  const utils = api.useUtils();
  const deleteMutation = api.post.delete.useMutation({
    onSuccess: async () => {
      await utils.post.list.invalidate();
    },
  });

  const onDelete = async () => {
    toast.promise(deleteMutation.mutateAsync({ id: post.id }), {
      loading: "Deleting post...",
      success: "Post deleted.",
      error: (err) => (err instanceof Error ? err.message : "Failed to delete post."),
    });
  };

  return (
    <div className="flex items-center justify-end gap-1">
      <EditPostDialog post={post} />
      <Button
        variant="ghost"
        size="icon"
        className="size-8 text-destructive"
        onClick={onDelete}
        disabled={deleteMutation.isPending}
      >
        <Trash2 className="size-4" />
        <span className="sr-only">Delete</span>
      </Button>
    </div>
  );
}

export const postColumnsBase: ColumnDef<PostRow>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return (
        <Badge variant="outline" className="font-normal text-xs">
          {date.toLocaleDateString()} {date.toLocaleTimeString()}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: () => null,
    cell: ({ row }) => <ActionsCell post={row.original} />,
  },
];
