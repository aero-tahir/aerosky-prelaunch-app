/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_OLA_MAP_API_KEY: string
    readonly clientId: string
    readonly clientSecret: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
