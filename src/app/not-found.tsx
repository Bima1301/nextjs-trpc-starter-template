import { routing } from "@/i18n/routing";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="font-semibold text-2xl">404 - Page not found</h1>
      <a
        href={`/${routing.defaultLocale}`}
        className="text-primary underline"
      >
        Go home
      </a>
    </div>
  );
}
