/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_ANALYTICS_ID: string;
  readonly VITE_FAUCET_API_URL: string;
  readonly VITE_GOOGLE_CAPTCHA_SITEKEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
