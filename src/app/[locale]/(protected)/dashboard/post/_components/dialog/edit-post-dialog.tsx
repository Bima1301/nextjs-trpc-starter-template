"use client";

import { useState } from "react";

import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { RouterOutputs } from "@/trpc/react";

import { PostForm } from "../form/post-form";

type Post = RouterOutputs["post"]["list"]["items"][number];

interface EditPostDialogProps {
  post: Post;
}

export function EditPostDialog({ post }: EditPostDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
          <Pencil className="size-4" />
          <span className="sr-only">Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit post</DialogTitle>
        </DialogHeader>
        <PostForm
          mode="edit"
          defaultValues={{
            id: post.id,
            name: post.name,
          }}
          onSuccess={() => {
            setOpen(false);
          }}
        />
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  );
}
