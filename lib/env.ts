import { unstable_noStore as noStore } from "next/cache";

function getEnv(key: string) {
  noStore();

  return process.env[key];
}

export function getBuildServerBaseUrl() {
  return getEnv("BUILD_SERVER_BASE_URL");
}

export function getSolangBuildServerBaseUrl() {
  return getEnv("SOLANG_BUILD_SERVER_BASE_URL");
}

export function getGoogleAnalyticsTag() {
  return getEnv("GA_TAG");
}

export function getGitHubToken() {
  return getEnv("GITHUB_API_KEY");
}

export function getSolidityEnabled() {
  return getEnv("SOLIDITY_ENABLED") === "true";
}

export function getFaucetUrl() {
  return getEnv("NEXT_PUBLIC_FAUCET_API_URL")
}

export function getGoogleCaptchaSitekey() {
  return getEnv("NEXT_PUBLIC_GOOGLE_CAPTCHA_SITEKEY");
}