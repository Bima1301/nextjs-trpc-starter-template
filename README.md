# NextJS tRPC Starter Template Frontend

Proyek Next.js 15 dengan **tRPC** (type-safe API) dan **Better Auth** (autentikasi). Menggunakan Prisma sebagai ORM, React Query untuk data fetching, dan shadcn/ui untuk komponen UI.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **API:** tRPC v11 + React Query
- **Auth:** Better Auth (email/password + GitHub OAuth)
- **Database:** PostgreSQL + Prisma
- **Validation:** Zod
- **Serialization:** SuperJSON
- **UI:** Tailwind CSS, Radix UI, shadcn/ui

## Persyaratan

- Node.js 18+
- Bun (atau npm/pnpm)
- PostgreSQL

## Setup

### 1. Clone & Install

```bash
git clone <repo-url>
cd nextjs-trpc-starter-template
bun install
```

### 2. Environment Variables

Buat file `.env` di root proyek (atau salin dari `.env.example`):

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/nextjs-trpc-starter-template"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key-min-32-chars"
FE_BASE_URL="http://localhost:3000"

# GitHub OAuth (opsional, untuk sign in with GitHub)
BETTER_AUTH_GITHUB_CLIENT_ID="your-github-client-id"
BETTER_AUTH_GITHUB_CLIENT_SECRET="your-github-client-secret"
```

| Variable               | Wajib     | Keterangan                                       |
| ---------------------- | --------- | ------------------------------------------------ |
| `DATABASE_URL`         | ✅        | Connection string PostgreSQL                     |
| `BETTER_AUTH_SECRET`   | ✅ (prod) | Secret untuk session (min 32 karakter)           |
| `FE_BASE_URL`          | ✅        | URL base frontend (mis. `http://localhost:3000`) |
| `BETTER_AUTH_GITHUB_*` | ❌        | Diperlukan jika pakai GitHub OAuth               |

### 3. Database

Generate Prisma client dan jalankan migrasi:

```bash
bun run db:generate   # atau: prisma migrate dev
bun run db:seed       # (opsional) seed data
```

### 4. Jalankan Development Server

```bash
bun run dev
```

Aplikasi berjalan di [http://localhost:3000](http://localhost:3000).

---

## Struktur Proyek (Relevan)

```
src/
├── app/
│   ├── (auth)/                 # Route group: login, register
│   │   ├── layout.tsx          # Layout auth (redirect jika sudah login)
│   │   ├── login/
│   │   ├── register/
│   │   └── _components/        # LoginForm, RegisterForm, GitHub button
│   ├── api/
│   │   ├── auth/[...all]/      # Better Auth handler
│   │   └── trpc/[trpc]/        # tRPC HTTP handler
│   ├── layout.tsx              # Root layout (TRPCReactProvider, Toaster)
│   └── page.tsx
├── server/
│   ├── api/
│   │   ├── trpc.ts             # Context, procedures (public/protected)
│   │   ├── root.ts             # App router (gabungan semua router)
│   │   └── routers/            # post, dll.
│   ├── better-auth/
│   │   ├── config.ts           # Konfigurasi Better Auth
│   │   ├── server.ts           # getSession() untuk RSC
│   │   ├── client.ts           # authClient untuk client component
│   │   └── index.ts
│   └── db.ts                   # Prisma client
├── trpc/
│   ├── react.tsx               # api (createTRPCReact), TRPCReactProvider
│   ├── server.ts               # api, HydrateClient untuk RSC
│   └── query-client.ts         # React Query + SuperJSON
├── components/
├── config/
└── lib/
```

---

## Better Auth

### Konfigurasi

- **Lokasi:** `src/server/better-auth/config.ts`
- **Adapter:** Prisma (PostgreSQL)
- **Fitur:** Email/Password + GitHub OAuth

### Penggunaan

**Di Server (RSC / Route Handler):**

```ts
import { auth } from "@/server/better-auth";
import { getSession } from "@/server/better-auth/server";

// Session di RSC
const session = await getSession();
if (session?.user) {
  // user sudah login
}

// Atau langsung
const session = await auth.api.getSession({ headers: await headers() });
```

**Di Client Component:**

```ts
"use client";
import { authClient } from "@/server/better-auth/client";

// Login email/password
await authClient.signIn.email({ email, password });

// Logout
await authClient.signOut();

// Sign in with GitHub
// (bisa pakai link/redirect ke callback atau authClient.signIn.social)
```

**Route API Auth:** Semua request ke `/api/auth/*` (login, logout, callback, dll.) ditangani oleh Better Auth di `src/app/api/auth/[...all]/route.ts`.

---

## tRPC

### Konfigurasi

- **Context:** `createTRPCContext` di `src/server/api/trpc.ts` — menyediakan `db`, `session` (dari Better Auth), dan `headers`.
- **Procedures:**
  - `publicProcedure` — bisa dipanggil tanpa login.
  - `protectedProcedure` — wajib login; `ctx.session.user` tersedia.

### Menambah Router Baru

1. Buat router di `src/server/api/routers/`, contoh:

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

2. Daftarkan di root router:

```ts
// src/server/api/root.ts
import { exampleRouter } from "@/server/api/routers/example";

export const appRouter = createTRPCRouter({
  post: postRouter,
  example: exampleRouter,
});
```

### Pemanggilan dari Client

```ts
"use client";
import { api } from "@/trpc/react";

function MyComponent() {
  const { data } = api.post.hello.useQuery({ text: "world" });
  const createPost = api.post.create.useMutation();
  // ...
}
```

### Pemanggilan dari RSC (Server Component)

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

| Script                | Keterangan                    |
| --------------------- | ----------------------------- |
| `bun run dev`         | Development (Next.js + Turbo) |
| `bun run build`       | Build production              |
| `bun run start`       | Jalankan build production     |
| `bun run db:generate` | Prisma migrate dev            |
| `bun run db:push`     | Prisma db push                |
| `bun run db:studio`   | Buka Prisma Studio            |
| `bun run db:seed`     | Jalankan seed                 |
| `bun run lint`        | ESLint                        |
| `bun run typecheck`   | TypeScript check              |

---

## Referensi

- [Next.js](https://nextjs.org/docs)
- [tRPC](https://trpc.io/docs)
- [Better Auth](https://www.better-auth.com/docs)
- [Prisma](https://www.prisma.io/docs)
- [T3 Stack](https://create.t3.gg)
