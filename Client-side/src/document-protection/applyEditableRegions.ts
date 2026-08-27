import type { DocumentPermissionResponse, RestrictEditingEditor } from './permissionTypes';

export function applyEditableRegions(
  editor: RestrictEditingEditor,
  permission: DocumentPermissionResponse,
): string[] {
  const availableBookmarks = new Set(editor.getBookmarks(false));
  const missingBookmarks: string[] = [];

  editor.currentUser = permission.identity;

  for (const bookmark of permission.editableBookmarks) {
    if (!availableBookmarks.has(bookmark)) {
      missingBookmarks.push(bookmark);
      continue;
    }

    try {
      editor.selection.selectBookmark(bookmark, true);
      editor.editor.insertEditingRegion(permission.identity);
    } catch {
      missingBookmarks.push(bookmark);
    }
  }

  return missingBookmarks;
}
