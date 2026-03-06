import { siGithub } from "simple-icons";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SimpleIcon } from "@/components/shared/simple-icon";
import { auth } from "@/server/better-auth";
import { redirect } from "next/navigation";

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
          redirect(res.url);
        }}
      >
        <SimpleIcon icon={siGithub} className="size-4" />
        Continue with Github
      </Button>
    </form>
  );
}
