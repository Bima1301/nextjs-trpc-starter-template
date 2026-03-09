"use no memo";

import type { ColumnDef } from "@tanstack/react-table";

import { createDragColumn } from "./drag-column";

export function withDndColumn<T>(columns: ColumnDef<T>[]): ColumnDef<T>[] {
  return [createDragColumn<T>(), ...columns];
}
