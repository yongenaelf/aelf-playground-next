export const env = {
    SOLIDITY_ENABLED: false,
    GOOGLE_ANALYTICS_ID: import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
    FAUCET_API_URL: import.meta.env.VITE_FAUCET_API_URL,
    GOOGLE_CAPTCHA_SITEKEY: import.meta.env.VITE_GOOGLE_CAPTCHA_SITEKEY,
    AELFSCAN_GRAPHQL_ENDPOINT: "https://test-indexer-api.aefinder.io/api/app/graphql/genesisapp",
    TMRWDAO_GRAPHQL_ENDPOINT: "https://test-indexer-api.aefinder.io/api/app/graphql/tomorrowdao_indexer"
}