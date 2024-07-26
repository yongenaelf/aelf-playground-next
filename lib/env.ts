import { unstable_noStore as noStore } from "next/cache";

function getEnv(key: string) {
  noStore();

  return process.env[key];
}

export function getBuildServerBaseUrl() {
  return getEnv("BUILD_SERVER_BASE_URL");
}

export function getGoogleAnalyticsTag() {
  return getEnv("GA_TAG");
}