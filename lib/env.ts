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
  // https://nextjs.org/docs/app/building-your-application/configuring/environment-variables#bundling-environment-variables-for-the-browser:~:text=Note%20that%20dynamic%20lookups%20will%20not%20be%20inlined%2C%20such%20as%3A
  const varName = "NEXT_PUBLIC_FAUCET_API_URL";
  return process.env[varName];
}

export function getGoogleCaptchaSitekey() {
  const varName = "NEXT_PUBLIC_GOOGLE_CAPTCHA_SITEKEY";
  return process.env[varName];
}