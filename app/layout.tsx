import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { PropsWithChildren, Suspense } from "react";
import TopMenu from "@/components/top-menu";
import clsx from "clsx";
import { GoogleAnalytics } from "@next/third-parties/google";
import { getGoogleAnalyticsTag } from "@/lib/env";

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
  const gaId = getGoogleAnalyticsTag();

  return (
    <html lang="en">
      <body className={clsx(font.className, "overflow-hidden")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="next-theme"
        >
          <TopMenu />
          <main className="h-[calc(100vh-66px)] overflow-auto">
            <Suspense>{children}</Suspense>
          </main>
        </ThemeProvider>
      </body>
      {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
    </html>
  );
}
