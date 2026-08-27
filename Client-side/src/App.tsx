import { useRef } from 'react';
import { AppHeader } from './components/AppHeader';
import { InformationPanel } from './components/InformationPanel';
import { PermissionSummary } from './components/PermissionSummary';
import { PermissionToolbar } from './components/PermissionToolbar';
import { ProtectedDocumentEditor } from './components/ProtectedDocumentEditor';
import { StatusBanner } from './components/StatusBanner';
import { SwitchProfileDialog } from './components/SwitchProfileDialog';
import { usePermissionSession } from './hooks/usePermissionSession';
import type { RestrictEditingEditor } from './document-protection/permissionTypes';
import './App.css';

function statusLabel(status: ReturnType<typeof usePermissionSession>['status']): string {
  switch (status) {
    case 'loading-permissions':
      return 'Loading permissions';
    case 'loading-document':
      return 'Loading document';
    case 'applying-protection':
      return 'Applying protection';
    case 'protected':
      return 'Protected';
    case 'error':
      return 'Unavailable';
    default: {
      const exhaustive: never = status;
      return String(exhaustive);
    }
  }
}

function App() {
  const session = usePermissionSession();
  const editorRef = useRef<RestrictEditingEditor | undefined>(undefined);
  const busy = session.status !== 'protected' && session.status !== 'error';
  const editorDisabled = session.status !== 'protected';

  const handleSetEditor = (editor: RestrictEditingEditor) => {
    editorRef.current = editor;
    session.setEditor(editor);
  };

  const handleShowRestrictEditingPane = () => {
    if (editorRef.current && typeof editorRef.current.showRestrictEditingPane === 'function') {
      editorRef.current.showRestrictEditingPane(true);
    }
  };

  return (
    <div className="app-shell">
      <AppHeader
        profile={session.profile}
        protectionActive={session.protectionActive}
        statusLabel={statusLabel(session.status)}
      />
      <PermissionToolbar
        profile={session.profile}
        grantedBookmarks={session.grantedBookmarks}
        busy={busy}
        onProfileChange={session.requestProfileChange}
        onShowRestrictEditingPane={handleShowRestrictEditingPane}
        onDownload={() => {
          void session.download();
        }}
      />
      <StatusBanner
        status={session.status}
        error={session.error}
        protectionActive={session.protectionActive}
        identity={session.permission?.identity}
        grantedBookmarks={session.grantedBookmarks}
        missingBookmarks={session.missingBookmarks}
        unknownRole={session.unknownRole}
        onRetry={() => {
          void session.reload();
        }}
      />
      <p className="mobile-notice">
        This sample is optimized for desktop editing. You can still view the protected document on
        smaller screens.
      </p>
      <div className="workspace">
        <div className="sidebar">
          <PermissionSummary
            permission={session.permission}
            grantedBookmarks={session.grantedBookmarks}
            missingBookmarks={session.missingBookmarks}
            unknownRole={session.unknownRole}
            loading={session.status === 'loading-permissions'}
          />
          <InformationPanel />
        </div>
        <main className="editor-pane" aria-label="Document editor">
          {busy ? (
            <div className="editor-loading-label">{statusLabel(session.status)}</div>
          ) : null}
          <ProtectedDocumentEditor
            disabled={editorDisabled}
            highlightEditableRanges={session.highlightEditableRanges}
            onReady={handleSetEditor}
            onContentChange={session.markDirty}
          />
        </main>
      </div>
      {session.pendingProfile ? (
        <SwitchProfileDialog
          profile={session.pendingProfile}
          onCancel={session.cancelProfileChange}
          onDiscard={() => {
            void session.confirmProfileChange('discard');
          }}
          onExport={() => {
            void session.confirmProfileChange('export');
          }}
        />
      ) : null}
    </div>
  );
}

export default App;
