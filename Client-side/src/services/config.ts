function withTrailingSlash(url: string): string {
  return url.endsWith('/') ? url : `${url}/`;
}

export const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

export const documentEditorServiceUrl = withTrailingSlash(
  import.meta.env.VITE_DOCUMENT_EDITOR_SERVICE_URL ?? 'https://app-271358-f7hca0bucyfndddu.scm.centralindia-01.azurewebsites.net/api/documenteditor/',
);

export const githubUrl = 'https://github.com/SyncfusionExamples/role-based-editable-regions-react-docx-editor';

export const documentationUrl =
  'https://help.syncfusion.com/document-processing/word/word-processor/react/restrict-editing';
