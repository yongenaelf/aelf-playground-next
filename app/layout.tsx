import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { PropsWithChildren, Suspense } from "react";
import TopMenu from "@/components/top-menu";
import clsx from "clsx";
import { GoogleAnalytics } from "@next/third-parties/google";
import Providers from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";
import { env, PublicEnvScript } from 'next-runtime-env';

const font = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "aelf Playground",
  description:
    "Easily Build, Deploy and Test aelf smart contracts from a browser IDE.",
};

export default function RootLayout({ children }: PropsWithChildren) {
  const gaId = env("NEXT_PUBLIC_GOOGLE_ANALYTICS_ID");

  return (
    <html lang="en">
      <head>
        <PublicEnvScript />
      </head>
      <body className={clsx(font.className, "overflow-hidden !pointer-events-auto")}>
        <Providers>
          <TopMenu />
          <main className="h-[calc(100vh-66px)] overflow-auto">
            <Suspense>{children}</Suspense>
          </main>
          <Toaster />
        </Providers>
      </body>
      {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
    </html>
  );
}
