import type { DocumentPermissionResponse } from '../document-protection/permissionTypes';
import { apiBaseUrl } from './config';

export class PermissionRequestError extends Error {
  public readonly status?: number;

  public constructor(message: string, status?: number) {
    super(message);
    this.name = 'PermissionRequestError';
    this.status = status;
  }
}

export async function fetchDocumentPermissions(
  profile: string,
  baseUrl: string = apiBaseUrl,
): Promise<DocumentPermissionResponse> {
  const url = `${baseUrl}/api/permissions?profile=${encodeURIComponent(profile)}`;
  let response: Response;

  try {
    response = await fetch(url, {
      headers: { Accept: 'application/json' },
    });
  } catch {
    throw new PermissionRequestError('The permission service could not be reached.');
  }

  if (!response.ok) {
    throw new PermissionRequestError(
      `Permission retrieval failed (${response.status}).`,
      response.status,
    );
  }

  const payload = (await response.json()) as Partial<DocumentPermissionResponse>;
  if (!isPermissionResponse(payload)) {
    throw new PermissionRequestError('The permission service returned an invalid contract.');
  }

  return payload;
}

function isPermissionResponse(value: Partial<DocumentPermissionResponse>): value is DocumentPermissionResponse {
  return (
    typeof value.userId === 'string' &&
    typeof value.identity === 'string' &&
    typeof value.displayName === 'string' &&
    typeof value.role === 'string' &&
    typeof value.issuedAtUtc === 'string' &&
    Array.isArray(value.editableBookmarks) &&
    value.editableBookmarks.every((bookmark) => typeof bookmark === 'string')
  );
}
