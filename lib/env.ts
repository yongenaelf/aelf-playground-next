export function getBuildServerBaseUrl() {
  return import.meta.env.VITE_BUILD_SERVER_BASE_URL;
}

export function getSolangBuildServerBaseUrl() {
  return import.meta.env.VITE_SOLANG_BUILD_SERVER_BASE_URL;
}

export function getSolidityEnabled() {
  return import.meta.env.VITE_SOLIDITY_ENABLED;
}