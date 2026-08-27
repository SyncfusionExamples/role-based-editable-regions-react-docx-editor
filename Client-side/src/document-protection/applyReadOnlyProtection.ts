import type { RestrictEditingEditor } from './permissionTypes';

const PROTECTION_TIMEOUT_MS = 4000;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function enforceReadOnlyProtection(
  editor: RestrictEditingEditor,
  password: string,
): Promise<void> {
  let rejected: unknown;

  const apply = (async () => {
    try {
      if (typeof editor.editor.enforceProtectionAsync === 'function') {
        await editor.editor.enforceProtectionAsync(password, 'ReadOnly');
        return;
      }

      await editor.editor.enforceProtection(password, 'ReadOnly');
    } catch (error) {
      rejected = error;
    }
  })();

  await Promise.race([apply, wait(PROTECTION_TIMEOUT_MS)]);

  if (editor.isDocumentProtected) {
    return;
  }

  if (rejected) {
    throw rejected;
  }

  throw new Error('Read-only protection was not applied.');
}

export function failClosed(editor: RestrictEditingEditor | undefined): void {
  if (!editor) {
    return;
  }

  editor.isReadOnly = true;
}
