import { headers } from "next/headers";

import { getLocale } from "next-intl/server";

import { Link, redirect } from "@/i18n/navigation";
import { auth } from "@/server/better-auth";
import { getSession } from "@/server/better-auth/server";
import { api, HydrateClient } from "@/trpc/server";


export default async function Home() {
  const session = await getSession();

  if (session) {
    void api.post.getLatest.prefetch();
  }

  return (
    <HydrateClient>
      <main className="min-h-screen overflow-x-hidden bg-[#09090b] font-mono text-zinc-100 antialiased">

        <div className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute top-[-200px] left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-6">

          <nav className="flex items-center justify-between border-zinc-800 border-b py-5">
            <span className="font-semibold text-lg text-zinc-100 tracking-tight">
              app<span className="text-violet-400">.</span>dev
            </span>

            <div className="flex items-center gap-3">
              <div className="mr-2 hidden gap-2 md:flex">
                {["Next.js", "tRPC", "Prisma", "BetterAuth"].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-zinc-800 px-2.5 py-1 text-[10px] text-zinc-500 uppercase tracking-widest"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {session ? (
                <>
                  <Link
                    href="/dashboard"
                    className="rounded-lg border border-zinc-700 px-4 py-2 text-sm transition-all hover:border-violet-500 hover:text-violet-400"
                  >
                    Dashboard →
                  </Link>
                  <form>
                    <button
                      type="submit"
                      formAction={async () => {
                        "use server";
                        await auth.api.signOut({
                          headers: await headers(),
                        });
                        redirect({ href: '/', locale: await getLocale() });
                      }}
                      className="rounded-lg px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:text-zinc-100"
                    >
                      Sign out
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-lg border border-zinc-700 px-4 py-2 text-sm transition-all hover:border-zinc-500"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-lg bg-violet-600 px-4 py-2 text-sm text-white shadow-lg shadow-violet-900/40 transition-all hover:-translate-y-px hover:bg-violet-500"
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>
          </nav>

          <section className="py-24 text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-4 py-1.5 text-[11px] text-violet-300 uppercase tracking-widest">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_6px_#4ade80]" />
              Ready to ship
            </div>

            <h1 className="mb-6 font-bold text-5xl text-zinc-100 leading-[1.05] tracking-tighter md:text-7xl">
              Build faster with{" "}
              <span className="font-normal text-violet-300 italic">type-safe</span>
              <br /> full-stack
            </h1>

            <p className="mx-auto mb-10 max-w-md text-base text-zinc-400 leading-relaxed">
              Starter siap pakai dengan Next.js, tRPC, BetterAuth, dan Prisma.
              Semua sudah terhubung — fokus saja ke produkmu.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              {session ? (
                <Link
                  href="/dashboard"
                  className="rounded-xl bg-violet-600 px-6 py-3 font-medium text-sm text-white shadow-lg shadow-violet-900/40 transition-all hover:-translate-y-px hover:bg-violet-500"
                >
                  Buka Dashboard →
                </Link>
              ) : (
                <Link
                  href="/register"
                  className="rounded-xl bg-violet-600 px-6 py-3 font-medium text-sm text-white shadow-lg shadow-violet-900/40 transition-all hover:-translate-y-px hover:bg-violet-500"
                >
                  Mulai sekarang
                </Link>
              )}
            </div>
          </section>

          <div className="mb-20 flex flex-wrap justify-center gap-8 border-zinc-800 border-y py-4">
            {[
              { label: "Next.js 15", color: "bg-zinc-100" },
              { label: "tRPC v11", color: "bg-blue-400" },
              { label: "BetterAuth", color: "bg-violet-400" },
              { label: "Prisma ORM", color: "bg-emerald-400" },
              { label: "TypeScript", color: "bg-sky-400" },
            ].map((t) => (
              <div key={t.label} className="flex items-center gap-2 text-xs text-zinc-500">
                <span className={`h-2 w-2 rounded-sm ${t.color}`} />
                {t.label}
              </div>
            ))}
          </div>

          <footer className="flex flex-col items-center justify-between gap-4 border-zinc-800 border-t py-6 text-xs text-zinc-600 sm:flex-row">
            <span>© {new Date().getFullYear()} app.dev — Built with Next.js</span>
            <div className="flex gap-5">
              {["Docs", "GitHub", "Privacy", "Terms"].map((l) => (
                <a key={l} href={`/${l.toLowerCase()}`} className="transition-colors hover:text-zinc-300">
                  {l}
                </a>
              ))}
            </div>
          </footer>

        </div>
      </main>

    </HydrateClient>
  );
}
