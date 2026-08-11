/// <reference types="vite/client" />
/// <reference types="pinia-plugin-persistedstate" />

export {}

declare global {
  interface Window {
    ELBaseUtils: {
      LOCAL_PROXY_SERVICE_PATH: Record<string, string>;
      SERVICE_PATH: Record<string, string>;
      SERVICE_CONTEXT_MAP: Record<string, string>;
    };
    EWebPlat: Record<string, (...args: unknown[]) => unknown>;
  }
}
