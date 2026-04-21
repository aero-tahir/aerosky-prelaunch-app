/// <reference types="vite/client" />

declare const __DEV_AUTH_USERS__: string;

interface ImportMetaEnv {
    readonly VITE_OLA_MAP_API_KEY: string
    readonly clientId: string
    readonly clientSecret: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
