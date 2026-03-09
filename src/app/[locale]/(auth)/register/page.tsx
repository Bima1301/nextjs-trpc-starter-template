import { useTranslations } from "next-intl";

import { APP_CONFIG } from "@/config/app-config";
import { Link } from "@/i18n/navigation";

import { GithubButton } from "../_components/github-button";
import { LocaleSwitcher } from "../_components/locale-switcher";
import { RegisterForm } from "../_components/register-form";

export default function RegisterV2() {
  const t = useTranslations("Auth");

  return (
    <>
      <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[350px]">
        <div className="space-y-2 text-center">
          <h1 className="font-medium text-3xl">{t("registerTitle")}</h1>
          <p className="text-muted-foreground text-sm">{t("registerSubtitle")}</p>
        </div>
        <div className="space-y-4">
          <GithubButton className="w-full" />
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-border after:border-t">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              {t("orContinueWith")}
            </span>
          </div>
          <RegisterForm />
        </div>
      </div>

      <div className="absolute top-5 flex w-full justify-end px-10">
        <div className="text-muted-foreground text-sm">
          {t("alreadyHaveAccount")}{" "}
          <Link prefetch={false} className="text-foreground" href="/login">
            {t("login")}
          </Link>
        </div>
      </div>

      <div className="absolute bottom-5 flex w-full justify-between px-10">
        <div className="text-sm">{APP_CONFIG.copyright}</div>
        <LocaleSwitcher />
      </div>
    </>
  );
}
