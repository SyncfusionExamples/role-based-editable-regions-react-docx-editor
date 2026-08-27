export const DEMO_PROFILES = ['Author', 'Reviewer', 'Viewer'] as const;

export type DemoProfile = (typeof DEMO_PROFILES)[number];

export interface DocumentPermissionResponse {
  userId: string;
  identity: string;
  displayName: string;
  role: string;
  editableBookmarks: string[];
  issuedAtUtc: string;
}

export type FailureStage = 'document' | 'permissions' | 'protection';

export interface RestrictEditingEditor {
  currentUser: string;
  isReadOnly?: boolean;
  isDocumentProtected?: boolean;
  getBookmarks(includeHidden: boolean): string[];
  selection: {
    selectBookmark(bookmarkName: string, excludeStartEnd?: boolean): void;
  };
  editor: {
    insertEditingRegion(user?: string): void;
    enforceProtection(credential: string, protectionType: string): void | Promise<void>;
    enforceProtectionAsync?(credential: string, protectionType: string): Promise<void>;
  };
  open(sfdt: string): void;
  openAsync?(sfdt: string): Promise<void>;
  save(fileName: string, format: string): void;
  hideBusyIndicator?(): void;
  showRestrictEditingPane?(show: boolean): void;
}

export function isDemoProfile(value: string): value is DemoProfile {
  return (DEMO_PROFILES as readonly string[]).includes(value);
}

export function assertNever(value: never): never {
  throw new Error(`Unhandled value: ${String(value)}`);
}
