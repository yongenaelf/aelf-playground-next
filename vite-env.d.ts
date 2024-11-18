/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SOLIDITY_ENABLED: string;
  readonly VITE_GOOGLE_ANALYTICS_ID: string;
  readonly VITE_FAUCET_API_URL: string;
  readonly VITE_GOOGLE_CAPTCHA_SITEKEY: string;
  readonly VITE_AELFSCAN_GRAPHQL_ENDPOINT: string;
  readonly VITE_TMRWDAO_GRAPHQL_ENDPOINT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
