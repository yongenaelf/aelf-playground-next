import { Outlet } from "react-router-dom";
import Providers from "@/components/providers";
import "../index.css";
import TopMenu from "@/components/top-menu";
import { Toaster } from "@/components/ui/toaster";
import ReactGA from "react-ga4";
import { useEffect } from "react";

const TRACKING_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;

export default function Root() {
  useEffect(() => {
    if (TRACKING_ID) ReactGA.initialize(TRACKING_ID);
  }, [TRACKING_ID]);

  return (
    <>
      <Providers>
        <TopMenu />
        <main className="h-[calc(100vh-66px)] overflow-auto">
          <Outlet />
        </main>
        <Toaster />
      </Providers>
    </>
  );
}
