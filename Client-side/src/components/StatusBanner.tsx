import type { SessionError, SessionStatus } from '../hooks/usePermissionSession';

interface StatusBannerProps {
  status: SessionStatus;
  error: SessionError | null;
  protectionActive: boolean;
  identity?: string;
  grantedBookmarks: string[];
  missingBookmarks: string[];
  unknownRole: boolean;
  onRetry: () => void;
}

function statusText(props: StatusBannerProps): string {
  if (props.error) {
    return `${props.error.stage} failed. ${props.error.message}`;
  }

  switch (props.status) {
    case 'loading-permissions':
      return 'Loading permissions from the backend. The editor stays disabled.';
    case 'loading-document':
      return 'Loading the unprotected sample template. The editor stays disabled.';
    case 'applying-protection':
      return 'Creating editable regions and enforcing read-only protection.';
    case 'protected':
      if (props.unknownRole) {
        return `Unknown role received. Identity ${props.identity ?? 'Unknown'} has view-only access.`;
      }
      if (props.grantedBookmarks.length === 0) {
        return `Protection is active for ${props.identity ?? 'the current identity'}. No editable regions were granted.`;
      }
      if (props.missingBookmarks.length > 0) {
        return `Protection is active. Missing bookmarks were skipped: ${props.missingBookmarks.join(', ')}.`;
      }
      return `Protection is active for ${props.identity ?? 'the current identity'}. Editable regions: ${props.grantedBookmarks.join(', ')}.`;
    case 'error':
      return 'The sample is unavailable until the failed stage is retried.';
    default: {
      const exhaustive: never = props.status;
      return String(exhaustive);
    }
  }
}

export function StatusBanner(props: StatusBannerProps) {
  const text = statusText(props);
  const isError = props.status === 'error' || props.error !== null;
  const isWarning = props.unknownRole || props.missingBookmarks.length > 0;

  return (
    <div
      className={`status-banner ${isError ? 'status-error' : isWarning ? 'status-warning' : 'status-info'}`}
      role="status"
      aria-live="polite"
    >
      <p>{text}</p>
      {isError ? (
        <button type="button" className="button-primary" onClick={props.onRetry}>
          Retry
        </button>
      ) : null}
    </div>
  );
}
