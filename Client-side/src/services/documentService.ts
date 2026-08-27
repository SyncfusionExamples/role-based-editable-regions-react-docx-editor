import { apiBaseUrl } from './config';

export class DocumentRequestError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'DocumentRequestError';
  }
}

export async function fetchTemplateSfdt(baseUrl: string = apiBaseUrl): Promise<string> {
  const url = `${baseUrl}/api/documents/template/sfdt`;
  let response: Response;

  try {
    response = await fetch(url, {
      headers: { Accept: 'application/json' },
    });
  } catch {
    throw new DocumentRequestError('The document service could not be reached.');
  }

  if (!response.ok) {
    throw new DocumentRequestError(`The sample template could not be loaded (${response.status}).`);
  }

  return response.text();
}

export function buildExportFileName(role: string, now: Date = new Date()): string {
  const stamp = now.toISOString().replaceAll(':', '-').replace(/\.\d{3}Z$/, 'Z');
  const safeRole = role.replaceAll(/[^A-Za-z0-9_-]/g, '') || 'Unknown';
  return `dynamic-permissions-${safeRole}-${stamp}.docx`;
}

export function downloadBlob(blob: Blob, fileName: string): void {
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = fileName;
  anchor.rel = 'noopener';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
}
