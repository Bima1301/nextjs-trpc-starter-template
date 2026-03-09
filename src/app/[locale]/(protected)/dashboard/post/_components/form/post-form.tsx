"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import type { PostCreateInput, PostUpdateInput } from "../../_server/schema";
import { postCreateSchema, postUpdateSchema } from "../../_server/schema";

type PostFormProps =
  | {
      mode: "create";
      defaultValues?: Partial<PostCreateInput>;
      onSuccess?: () => void;
    }
  | {
      mode: "edit";
      defaultValues: PostUpdateInput;
      onSuccess?: () => void;
    };

export function PostForm(props: PostFormProps) {
  const { mode, onSuccess } = props;

  const utils = api.useUtils();
  const createMutation = api.post.create.useMutation({
    onSuccess: async () => {
      await utils.post.list.invalidate();
    },
  });
  const updateMutation = api.post.update.useMutation({
    onSuccess: async () => {
      await utils.post.list.invalidate();
    },
  });

  const schema = mode === "create" ? postCreateSchema : postUpdateSchema;

  const form = useForm<PostCreateInput | PostUpdateInput>({
    resolver: zodResolver(schema),
    defaultValues:
      mode === "create"
        ? {
            name: "",
            ...(props.defaultValues ?? {}),
          }
        : props.defaultValues,
  });

  const onSubmit = async (values: PostCreateInput | PostUpdateInput) => {
    toast.promise(
      (async () => {
        if (mode === "create") {
          await createMutation.mutateAsync(values as PostCreateInput);
        } else {
          await updateMutation.mutateAsync(values as PostUpdateInput);
        }
      })(),
      {
        loading: mode === "create" ? "Creating post..." : "Updating post...",
        success: () => {
          onSuccess?.();
          return mode === "create" ? "Post created." : "Post updated.";
        },
        error: (err) => {
          if (err instanceof Error) return err.message;
          return "Something went wrong.";
        },
      },
    );
  };

  const isSubmitting = form.formState.isSubmitting || createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Post name" autoFocus />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {mode === "create" ? "Create" : "Save changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

