import { applyEditableRegions } from './applyEditableRegions';
import { enforceReadOnlyProtection, failClosed } from './applyReadOnlyProtection';
import { logFailure, logPermissionDecision } from './logging';
import type { DocumentPermissionResponse, RestrictEditingEditor } from './permissionTypes';

export interface ApplyPermissionResult {
  missingBookmarks: string[];
  grantedBookmarks: string[];
}

export async function openCleanTemplate(
  editor: RestrictEditingEditor,
  sfdt: string,
): Promise<void> {
  if (typeof editor.openAsync === 'function') {
    await editor.openAsync(sfdt);
  } else {
    editor.open(sfdt);
  }

  await new Promise<void>((resolve) => {
    setTimeout(resolve, 200);
  });
}

export async function applyPermissionsAndProtect(
  editor: RestrictEditingEditor,
  permission: DocumentPermissionResponse,
  password: string,
): Promise<ApplyPermissionResult> {
  const missingBookmarks = applyEditableRegions(editor, permission);
  const missing = new Set(missingBookmarks);
  const grantedBookmarks = permission.editableBookmarks.filter((bookmark) => !missing.has(bookmark));

  logPermissionDecision(permission.userId, permission.identity, grantedBookmarks, missingBookmarks);

  try {
    await enforceReadOnlyProtection(editor, password);
  } catch (error) {
    failClosed(editor);
    logFailure('protection', permission.userId);
    throw error;
  }

  return { missingBookmarks, grantedBookmarks };
}
