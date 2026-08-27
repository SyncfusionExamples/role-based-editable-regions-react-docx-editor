import { hideSpinner } from '@syncfusion/ej2-popups';
import type { DocumentEditor } from '@syncfusion/ej2-react-documenteditor';
import type { RestrictEditingEditor } from './permissionTypes';

export function adaptDocumentEditor(editor: DocumentEditor): RestrictEditingEditor {
  return {
    get currentUser() {
      return editor.currentUser;
    },
    set currentUser(value: string) {
      editor.currentUser = value;
    },
    get isReadOnly() {
      return editor.isReadOnly;
    },
    set isReadOnly(value: boolean) {
      editor.isReadOnly = value;
    },
    get isDocumentProtected() {
      return editor.documentHelper.isDocumentProtected;
    },
    getBookmarks() {
      return editor.getBookmarks();
    },
    selection: {
      selectBookmark(bookmarkName: string, excludeStartEnd?: boolean) {
        editor.selection.selectBookmark(bookmarkName, excludeStartEnd);
      },
    },
    editor: {
      insertEditingRegion(user?: string) {
        if (user === undefined) {
          editor.editor.insertEditingRegion();
          return;
        }

        editor.editor.insertEditingRegion(user);
      },
      enforceProtection(credential: string, protectionType: string) {
        editor.editor.enforceProtection(credential, protectionType as 'ReadOnly');
      },
      enforceProtectionAsync(credential: string, protectionType: string) {
        return editor.editor.enforceProtectionAsync(credential, protectionType as 'ReadOnly').finally(() => {
          hideSpinner(editor.element);
        });
      },
    },
    open(sfdt: string) {
      editor.open(sfdt);
    },
    openAsync(sfdt: string) {
      return editor.openAsync(sfdt).finally(() => {
        hideSpinner(editor.element);
      });
    },
    save(fileName: string, format: string) {
      editor.save(fileName, format as 'Docx');
    },
    hideBusyIndicator() {
      hideSpinner(editor.element);
    },
    showRestrictEditingPane(show: boolean) {
      editor.showRestrictEditingPane(show);
    },
  };
}
