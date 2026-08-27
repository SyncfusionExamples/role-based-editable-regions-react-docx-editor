import { useCallback, useEffect, useRef, useState } from 'react';
import { applyPermissionsAndProtect, openCleanTemplate } from '../document-protection/permissionSession';
import {
  assertNever,
  isDemoProfile,
  type DemoProfile,
  type DocumentPermissionResponse,
  type FailureStage,
  type RestrictEditingEditor,
} from '../document-protection/permissionTypes';
import { SAMPLE_PROTECTION_PASSWORD } from '../document-protection/sampleProtectionPassword';
import { logFailure } from '../document-protection/logging';
import { failClosed } from '../document-protection/applyReadOnlyProtection';
import { buildExportFileName, fetchTemplateSfdt } from '../services/documentService';
import { fetchDocumentPermissions } from '../services/permissionService';

export type SessionStatus =
  | 'loading-document'
  | 'loading-permissions'
  | 'applying-protection'
  | 'protected'
  | 'error';

export interface SessionError {
  stage: FailureStage;
  message: string;
}

export interface PermissionSession {
  status: SessionStatus;
  profile: DemoProfile;
  permission: DocumentPermissionResponse | null;
  missingBookmarks: string[];
  grantedBookmarks: string[];
  highlightEditableRanges: boolean;
  protectionActive: boolean;
  dirty: boolean;
  unknownRole: boolean;
  error: SessionError | null;
  editorReady: boolean;
  pendingProfile: DemoProfile | null;
  setEditor: (editor: RestrictEditingEditor) => void;
  markDirty: () => void;
  setHighlightEditableRanges: (value: boolean) => void;
  requestProfileChange: (profile: DemoProfile) => void;
  confirmProfileChange: (action: 'discard' | 'export') => Promise<void>;
  cancelProfileChange: () => void;
  reload: () => Promise<void>;
  download: () => void;
}

function failureMessage(stage: FailureStage): string {
  switch (stage) {
    case 'document':
      return 'The sample document could not be loaded. The editor remains unavailable.';
    case 'permissions':
      return 'Permissions could not be retrieved. The editor remains unavailable and was not opened for unrestricted editing.';
    case 'protection':
      return 'Read-only protection could not be applied. The editor stays locked so the unprotected document is not exposed.';
    default:
      return assertNever(stage);
  }
}

export function usePermissionSession(): PermissionSession {
  const editorRef = useRef<RestrictEditingEditor | undefined>(undefined);
  const inFlightRef = useRef(false);
  const [editorReady, setEditorReady] = useState(false);
  const [status, setStatus] = useState<SessionStatus>('loading-permissions');
  const [profile, setProfile] = useState<DemoProfile>('Author');
  const [permission, setPermission] = useState<DocumentPermissionResponse | null>(null);
  const [missingBookmarks, setMissingBookmarks] = useState<string[]>([]);
  const [grantedBookmarks, setGrantedBookmarks] = useState<string[]>([]);
  const [highlightEditableRanges, setHighlightState] = useState(true);
  const [protectionActive, setProtectionActive] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [unknownRole, setUnknownRole] = useState(false);
  const [error, setError] = useState<SessionError | null>(null);
  const [pendingProfile, setPendingProfile] = useState<DemoProfile | null>(null);
  const highlightRef = useRef(highlightEditableRanges);
  highlightRef.current = highlightEditableRanges;

  const applyProfile = useCallback(async (nextProfile: DemoProfile) => {
    const editor = editorRef.current;
    if (!editor || inFlightRef.current) {
      return;
    }

    inFlightRef.current = true;
    setError(null);
    setProtectionActive(false);
    setUnknownRole(false);
    setMissingBookmarks([]);
    setGrantedBookmarks([]);
    setPermission(null);
    setProfile(nextProfile);
    setStatus('loading-permissions');

    let loadedPermission: DocumentPermissionResponse | undefined;

    try {
      loadedPermission = await fetchDocumentPermissions(nextProfile);
      setPermission(loadedPermission);
      const isUnknown = !isDemoProfile(loadedPermission.role);
      setUnknownRole(isUnknown);
    } catch {
      logFailure('permissions');
      failClosed(editor);
      setError({ stage: 'permissions', message: failureMessage('permissions') });
      setStatus('error');
      inFlightRef.current = false;
      return;
    }

    setStatus('loading-document');

    try {
      const sfdt = await fetchTemplateSfdt();
      await openCleanTemplate(editor, sfdt);
    } catch {
      logFailure('document', loadedPermission.userId);
      failClosed(editor);
      setError({ stage: 'document', message: failureMessage('document') });
      setStatus('error');
      inFlightRef.current = false;
      return;
    }

    setStatus('applying-protection');

    try {
      const result = await applyPermissionsAndProtect(
        editor,
        loadedPermission,
        SAMPLE_PROTECTION_PASSWORD,
      );
      setMissingBookmarks(result.missingBookmarks);
      setGrantedBookmarks(result.grantedBookmarks);
      setProtectionActive(true);
      setDirty(false);
      setStatus('protected');
    } catch {
      setError({ stage: 'protection', message: failureMessage('protection') });
      setStatus('error');
    } finally {
      editor.hideBusyIndicator?.();
      inFlightRef.current = false;
    }
  }, []);

  const setEditor = useCallback((editor: RestrictEditingEditor) => {
    editorRef.current = editor;
    setEditorReady(true);
  }, []);

  const markDirty = useCallback(() => {
    if (inFlightRef.current) {
      return;
    }

    setDirty(true);
  }, []);

  const setHighlightEditableRanges = useCallback((value: boolean) => {
    setHighlightState(value);
  }, []);

  const requestProfileChange = useCallback(
    (nextProfile: DemoProfile) => {
      if (nextProfile === profile || inFlightRef.current) {
        return;
      }

      if (dirty) {
        setPendingProfile(nextProfile);
        return;
      }

      void applyProfile(nextProfile);
    },
    [applyProfile, dirty, profile],
  );

  const download = useCallback(() => {
    const editor = editorRef.current;
    if (!editor || !permission) {
      return;
    }

    const fileName = buildExportFileName(permission.role).replace('.docx', '');
    editor.save(fileName, 'Docx');
    setDirty(false);
  }, [permission]);

  const confirmProfileChange = useCallback(
    async (action: 'discard' | 'export') => {
      const nextProfile = pendingProfile;
      if (!nextProfile) {
        return;
      }

      if (action === 'export') {
        download();
      }

      setPendingProfile(null);
      await applyProfile(nextProfile);
    },
    [applyProfile, download, pendingProfile],
  );

  const cancelProfileChange = useCallback(() => {
    setPendingProfile(null);
  }, []);

  const reload = useCallback(async () => {
    await applyProfile(profile);
  }, [applyProfile, profile]);

  useEffect(() => {
    if (!editorReady) {
      return;
    }

    void applyProfile('Author');
  }, [applyProfile, editorReady]);

  return {
    status,
    profile,
    permission,
    missingBookmarks,
    grantedBookmarks,
    highlightEditableRanges,
    protectionActive,
    dirty,
    unknownRole,
    error,
    editorReady,
    pendingProfile,
    setEditor,
    markDirty,
    setHighlightEditableRanges,
    requestProfileChange,
    confirmProfileChange,
    cancelProfileChange,
    reload,
    download,
  };
}
