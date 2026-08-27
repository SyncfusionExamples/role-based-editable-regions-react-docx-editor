/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_DOCUMENT_EDITOR_SERVICE_URL?: string;
  readonly VITE_SYNCFUSION_LICENSE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
