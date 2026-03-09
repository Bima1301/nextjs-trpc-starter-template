import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "NextJS tRPC Starter Template",
  version: packageJson.version,
  copyright: `© ${currentYear}, NextJS tRPC Starter Template.`,
  meta: {
    title: "NextJS tRPC Starter Template - Modern Next.js Dashboard Starter Template",
    description:
      "NextJS tRPC Starter Template is a modern, open-source dashboard starter template built with Next.js 16, Tailwind CSS v4, and shadcn/ui. Perfect for SaaS apps, admin panels, and internal tools—fully customizable and production-ready.",
  },
};
