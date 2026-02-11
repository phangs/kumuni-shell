// src/types/env.d.ts

// Declare the global object for React Native environment
declare var global: NodeJS.Global & typeof globalThis;

declare module '@env' {
  export const CENTRAL_API_URL: string;
  export const CENTRAL_API_KEY: string;
  export const CENTRAL_API_SECRET: string;
  export const TENANT_API_URL: string;
  export const TENANT_API_KEY: string;
  export const TENANT_API_SECRET: string;
  export const TENANT_ID: string;
  export const DEV_MODE: string;
  export const MOCK_INTERCEPTOR_ENABLED: string;
}