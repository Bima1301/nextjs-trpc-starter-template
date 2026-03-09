import { api, HydrateClient } from "@/trpc/server";

import { PostTable } from "./_components/table/post-table";

export default async function Page() {
  await api.post.list.prefetch({ page: 1, limit: 10, search: "" });

  return (
    <HydrateClient>
      <PostTable />
    </HydrateClient>
  );
}

