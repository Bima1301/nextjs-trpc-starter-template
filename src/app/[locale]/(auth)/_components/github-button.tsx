import { getLocale } from "next-intl/server";
import { siGithub } from "simple-icons";

import { SimpleIcon } from "@/components/shared/simple-icon";
import { Button } from "@/components/ui/button";
import { redirect } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { auth } from "@/server/better-auth";

export function GithubButton({ className, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <form>
      <Button variant="secondary" className={cn(className)} {...props}
        formAction={async () => {
          "use server";
          const res = await auth.api.signInSocial({
            body: {
              provider: "github",
              callbackURL: "/",
            },
          });
          if (!res.url) {
            throw new Error("No URL returned from signInSocial");
          }
          redirect({ href: res.url, locale: await getLocale() });
        }}
      >
        <SimpleIcon icon={siGithub} className="size-4" />
        Continue with Github
      </Button>
    </form>
  );
}
