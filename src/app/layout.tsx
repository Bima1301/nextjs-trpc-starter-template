import type { ReactNode } from "react";

import { Geist } from "next/font/google";

import { PREFERENCE_DEFAULTS } from "@/lib/preferences/preferences-config";
import { PreferencesStoreProvider } from "@/stores/preferences/preferences-provider";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const {
    theme_mode,
    theme_preset,
    content_layout,
    navbar_style,
    sidebar_variant,
    sidebar_collapsible,
    font,
  } = PREFERENCE_DEFAULTS;

  return (
    <html
      lang="en"
      className={geist.variable}
      suppressHydrationWarning
      data-theme-mode={theme_mode}
      data-theme-preset={theme_preset}
      data-content-layout={content_layout}
      data-navbar-style={navbar_style}
      data-sidebar-variant={sidebar_variant}
      data-sidebar-collapsible={sidebar_collapsible}
      data-font={font}
    >
      <body suppressHydrationWarning>
        <PreferencesStoreProvider
          themeMode={theme_mode}
          themePreset={theme_preset}
          contentLayout={content_layout}
          navbarStyle={navbar_style}
          font={font}
        >
          {children}
        </PreferencesStoreProvider>
      </body>
    </html>
  );
}
