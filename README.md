# NextJS tRPC Starter Template Frontend

A full‑stack dashboard starter built with **Next.js 15 App Router**, **tRPC v11**, **Better Auth**, and **Prisma**, including i18n, theming, persistent layout preferences, and URL state via **nuqs**.

## Tech Stack (7 core pillars)

- **Next.js 15 (App Router)**: Modern routing with Server Components, route groups, and middleware.
- **tRPC v11 + SuperJSON + React Query**: End‑to‑end type‑safe API with client‑side caching & mutations.
- **Better Auth + Prisma**: Email/password & GitHub OAuth on top of Prisma/PostgreSQL.
- **Prisma ORM**: Typed schema, migrations, and database client.
- **next-intl i18n**: Locale‑based routing (`/[locale]`) and translations across the UI.
- **UI: Tailwind CSS + shadcn/ui + Radix**: Headless components styled for a modern dashboard.
- **State & DX: Zustand + Biome + TypeScript + nuqs**: Global preferences store, fast linter/formatter, full typing, and URL‑synced state for filters & pagination.

## Requirements

- Node.js 18+
- Bun (or npm/pnpm)
- PostgreSQL

## Setup

### 1. Clone & Install

```bash
git clone <repo-url>
cd nextjs-trpc-starter-template
bun install
```

### 2. Environment Variables

Create a `.env` file at the project root (or copy from `.env.example`):

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/nextjs-trpc-starter-template"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key-min-32-chars"
FE_BASE_URL="http://localhost:3000"

# GitHub OAuth (optional, for sign in with GitHub)
BETTER_AUTH_GITHUB_CLIENT_ID="your-github-client-id"
BETTER_AUTH_GITHUB_CLIENT_SECRET="your-github-client-secret"
```

| Variable               | Required | Description                                      |
| ---------------------- | -------- | ------------------------------------------------ |
| `DATABASE_URL`         | ✅       | PostgreSQL connection string                     |
| `BETTER_AUTH_SECRET`   | ✅ (prod)| Session secret (min 32 characters)               |
| `FE_BASE_URL`          | ✅       | Frontend base URL (e.g. `http://localhost:3000`) |
| `BETTER_AUTH_GITHUB_*` | ❌       | Needed if using GitHub OAuth                     |

### 3. Database

Generate Prisma client and run migrations:

```bash
bun run db:generate   # or: prisma migrate dev
bun run db:seed       # optional: seed data
```

### 4. Run Development Server

```bash
bun run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## Project Structure (Relevant)

```text
src/
├── app/
│   ├── [locale]/                      # Locale segment (en, id, ...)
│   │   ├── (public)/                  # Landing page
│   │   │   └── page.tsx
│   │   ├── (auth)/                    # Route group: login, register
│   │   │   ├── layout.tsx             # Auth layout (redirects if already logged in)
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── _components/           # LoginForm, RegisterForm, GitHub button, locale switcher
│   │   ├── (protected)/dashboard/     # Protected dashboard routes
│   │   │   ├── layout.tsx             # Layout with sidebar, preferences, etc.
│   │   │   └── ...
│   │   └── layout.tsx                 # Locale‑aware layout (next-intl, TRPCReactProvider, Toaster)
│   ├── api/
│   │   ├── auth/[...all]/             # Better Auth handler
│   │   └── trpc/[trpc]/               # tRPC HTTP handler
│   └── layout.tsx                     # Root shell (fonts + preference data‑attributes)
├── server/
│   ├── api/
│   │   ├── trpc.ts                    # Context, procedures (public/protected)
│   │   ├── root.ts                    # App router (router composition)
│   │   └── routers/                   # Domain routers (post, etc.)
│   ├── better-auth/
│   │   ├── config.ts                  # Better Auth configuration
│   │   ├── server.ts                  # getSession() for RSC
│   │   ├── client.ts                  # authClient for client components
│   │   └── index.ts
│   └── db.ts                          # Prisma client
├── trpc/
│   ├── react.tsx                      # api (createTRPCReact), TRPCReactProvider
│   ├── server.ts                      # api helpers, HydrateClient for RSC
│   └── query-client.ts                # React Query + SuperJSON
├── components/
├── config/
└── lib/
```

---

## Better Auth

### Configuration

- **Location:** `src/server/better-auth/config.ts`
- **Adapter:** Prisma (PostgreSQL)
- **Features:** Email/password + GitHub OAuth

### Usage

**On the server (RSC / Route Handler):**

```ts
import { auth } from "@/server/better-auth";
import { getSession } from "@/server/better-auth/server";

// Session in an RSC
const session = await getSession();
if (session?.user) {
  // user is logged in
}

// Or directly
const session = await auth.api.getSession({ headers: await headers() });
```

**In a Client Component:**

```ts
"use client";
import { authClient } from "@/server/better-auth/client";

// Login with email/password
await authClient.signIn.email({ email, password });

// Logout
await authClient.signOut();

// Sign in with GitHub
// (via redirect to the callback or authClient.signIn.social)
```

**Auth API Route:** All requests to `/api/auth/*` (login, logout, callback, etc.) are handled by Better Auth in `src/app/api/auth/[...all]/route.ts`.

---

## tRPC

### Configuration

- **Context:** `createTRPCContext` in `src/server/api/trpc.ts` — exposes `db`, `session` (from Better Auth), and `headers`.
- **Procedures:**
  - `publicProcedure` — accessible without auth.
  - `protectedProcedure` — requires auth; `ctx.session.user` is guaranteed.

### Adding a New Router

1. Create a router in `src/server/api/routers/`, for example:

```ts
// src/server/api/routers/example.ts
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => ({ greeting: `Hello ${input.text}` })),

  secret: protectedProcedure.query(({ ctx }) => {
    return { userId: ctx.session.user.id };
  }),
});
```

2. Register it in the root router:

```ts
// src/server/api/root.ts
import { exampleRouter } from "@/server/api/routers/example";

export const appRouter = createTRPCRouter({
  post: postRouter,
  example: exampleRouter,
});
```

### Calling from a Client Component

```ts
"use client";
import { api } from "@/trpc/react";

function MyComponent() {
  const { data } = api.post.hello.useQuery({ text: "world" });
  const createPost = api.post.create.useMutation();
  // ...
}
```

### Calling from an RSC (Server Component)

```ts
import { api, HydrateClient } from "@/trpc/server";

export default async function Page() {
  const result = await api.post.hello({ text: "from server" });
  return (
    <HydrateClient>
      <div>{result.greeting}</div>
    </HydrateClient>
  );
}
```

---

## Scripts

| Script                | Description                      |
| --------------------- | -------------------------------- |
| `bun run dev`         | Development (Next.js + Turbo)    |
| `bun run build`       | Production build                 |
| `bun run start`       | Start production build           |
| `bun run db:generate` | Prisma migrate dev               |
| `bun run db:push`     | Prisma db push                   |
| `bun run db:studio`   | Open Prisma Studio               |
| `bun run db:seed`     | Run seed script                  |
| `bun run lint`        | Biome lint                       |
| `bun run typecheck`   | TypeScript type-check            |

---

## References

- [Next.js](https://nextjs.org/docs)
- [tRPC](https://trpc.io/docs)
- [Better Auth](https://www.better-auth.com/docs)
- [Prisma](https://www.prisma.io/docs)
- [T3 Stack](https://create.t3.gg)
