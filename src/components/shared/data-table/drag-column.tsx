"use no memo";

import { useSortable } from "@dnd-kit/sortable";
import type { ColumnDef } from "@tanstack/react-table";
import { GripVertical } from "lucide-react";

import { Button } from "@/components/ui/button";

function DragHandle({ id }: { id: string }) {
  const { attributes, listeners } = useSortable({
    id,
  });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:bg-transparent"
    >
      <GripVertical className="size-3 text-muted-foreground" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

export function createDragColumn<T>(): ColumnDef<T> {
  return {
    id: "drag",
    header: () => null,
    cell: ({ row }) => {
      const original = row.original as { id?: string };
      const id = original?.id ?? "";
      return <DragHandle id={id} />;
    },
    enableSorting: false,
    enableHiding: false,
  };
}
