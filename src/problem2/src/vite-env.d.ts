/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PRICES_URL: string;
  readonly VITE_TOKEN_ICON_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
