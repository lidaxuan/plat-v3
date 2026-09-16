/// <reference types="vite/client" />
/// <reference types="pinia-plugin-persistedstate" />


declare global {
  interface Window {
    [key: string]: any;
  }
}

interface Window {
  [key: string]: any;
}
