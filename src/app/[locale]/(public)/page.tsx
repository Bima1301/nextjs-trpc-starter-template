import { headers } from "next/headers";

import { getLocale, getTranslations } from "next-intl/server";

import { Link, redirect } from "@/i18n/navigation";
import { auth } from "@/server/better-auth";
import { getSession } from "@/server/better-auth/server";
import { api, HydrateClient } from "@/trpc/server";

export default async function Home() {
  const session = await getSession();
  const t = await getTranslations("Landing");

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
                {[
                  t("stackNext"),
                  t("stackTrpc"),
                  t("stackAuth"),
                  // t("stackPrisma"),
                  // t("stackIntl"),
                  // t("stackQuery"),
                  // t("stackUi"),
                  t("stackNuqs"),
                ].map((label) => (
                  <span
                    key={label}
                    className="rounded-full border border-zinc-800 px-2.5 py-1 text-[10px] text-zinc-500 uppercase tracking-widest"
                  >
                    {label}
                  </span>
                ))}
              </div>

              {session ? (
                <>
                  <Link
                    href="/dashboard"
                    className="rounded-lg border border-zinc-700 px-4 py-2 text-sm transition-all hover:border-violet-500 hover:text-violet-400"
                  >
                    {t("navDashboard")}
                  </Link>
                  <form>
                    <button
                      type="submit"
                      formAction={async () => {
                        "use server";
                        await auth.api.signOut({
                          headers: await headers(),
                        });
                        redirect({ href: "/", locale: await getLocale() });
                      }}
                      className="rounded-lg px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:text-zinc-100"
                    >
                      {t("navSignOut")}
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-lg border border-zinc-700 px-4 py-2 text-sm transition-all hover:border-zinc-500"
                  >
                    {t("navSignIn")}
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-lg bg-violet-600 px-4 py-2 text-sm text-white shadow-lg shadow-violet-900/40 transition-all hover:-translate-y-px hover:bg-violet-500"
                  >
                    {t("navGetStarted")}
                  </Link>
                </>
              )}
            </div>
          </nav>

          <section className="py-24 text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-4 py-1.5 text-[11px] text-violet-300 uppercase tracking-widest">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_6px_#4ade80]" />
              {t("badge")}
            </div>

            <h1 className="mb-6 font-bold text-5xl text-zinc-100 leading-[1.05] tracking-tighter md:text-7xl">
              {t("heroTitleLine1")}{" "}
              <span className="font-normal text-violet-300 italic">{t("heroTitleEmphasis")}</span>
              <br />
              {t("heroTitleLine2")}
            </h1>

            <p className="mx-auto mb-10 max-w-md text-base text-zinc-400 leading-relaxed">
              {t("heroDescription")}
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              {session ? (
                <Link
                  href="/dashboard"
                  className="rounded-xl bg-violet-600 px-6 py-3 font-medium text-sm text-white shadow-lg shadow-violet-900/40 transition-all hover:-translate-y-px hover:bg-violet-500"
                >
                  {t("ctaOpenDashboard")}
                </Link>
              ) : (
                <Link
                  href="/register"
                  className="rounded-xl bg-violet-600 px-6 py-3 font-medium text-sm text-white shadow-lg shadow-violet-900/40 transition-all hover:-translate-y-px hover:bg-violet-500"
                >
                  {t("ctaGetStarted")}
                </Link>
              )}
            </div>
          </section>

          <div className="mb-20 flex flex-wrap justify-center gap-8 border-zinc-800 border-y py-4">
            {[
              { key: "stackNext", color: "bg-zinc-100" },
              { key: "stackTrpc", color: "bg-blue-400" },
              { key: "stackPrisma", color: "bg-emerald-400" },
              { key: "stackAuth", color: "bg-violet-400" },
              { key: "stackIntl", color: "bg-amber-400" },
              { key: "stackQuery", color: "bg-sky-400" },
              { key: "stackUi", color: "bg-pink-400" },
              { key: "stackNuqs", color: "bg-indigo-400" },
            ].map((item) => (
              <div key={item.key} className="flex items-center gap-2 text-xs text-zinc-500">
                <span className={`h-2 w-2 rounded-sm ${item.color}`} />
                {t(item.key)}
              </div>
            ))}
          </div>

          <footer className="flex flex-col items-center justify-between gap-4 border-zinc-800 border-t py-6 text-xs text-zinc-600 sm:flex-row">
            <span>
              © {new Date().getFullYear()} app.dev — {t("footerBuiltWith")}
            </span>
            <div className="flex gap-5">
              <a href="/docs" className="transition-colors hover:text-zinc-300">
                {t("footerDocs")}
              </a>
              <a href="/github" className="transition-colors hover:text-zinc-300">
                {t("footerGitHub")}
              </a>
              <a href="/privacy" className="transition-colors hover:text-zinc-300">
                {t("footerPrivacy")}
              </a>
              <a href="/terms" className="transition-colors hover:text-zinc-300">
                {t("footerTerms")}
              </a>
            </div>
          </footer>

        </div>
      </main>

    </HydrateClient>
  );
}
