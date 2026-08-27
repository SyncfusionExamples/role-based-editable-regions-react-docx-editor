import type { DocumentPermissionResponse } from '../document-protection/permissionTypes';

interface PermissionSummaryProps {
  permission: DocumentPermissionResponse | null;
  grantedBookmarks: string[];
  missingBookmarks: string[];
  unknownRole: boolean;
  loading: boolean;
}

export function PermissionSummary({
  permission,
  grantedBookmarks,
  missingBookmarks,
  unknownRole,
  loading,
}: PermissionSummaryProps) {
  if (loading && !permission) {
    return (
      <section className="panel" aria-label="Permission summary">
        <div className="skeleton skeleton-title" />
        <div className="skeleton" />
        <div className="skeleton" />
        <div className="skeleton" />
      </section>
    );
  }

  if (!permission) {
    return (
      <section className="panel" aria-label="Permission summary">
        <h2>Permission summary</h2>
        <p className="muted">No permission response is available.</p>
      </section>
    );
  }

  return (
    <section className="panel" aria-label="Permission summary">
      <h2>Permission summary</h2>
      <dl className="summary-list">
        <div>
          <dt>Identity</dt>
          <dd>{permission.identity}</dd>
        </div>
        <div>
          <dt>Display name</dt>
          <dd>{permission.displayName}</dd>
        </div>
        <div>
          <dt>Role</dt>
          <dd>{permission.role}</dd>
        </div>
        <div>
          <dt>Issued</dt>
          <dd>{new Date(permission.issuedAtUtc).toUTCString()}</dd>
        </div>
      </dl>
      <h3>Backend-granted bookmarks</h3>
      {grantedBookmarks.length === 0 ? (
        <p className="status-note">This identity has view-only access. No editable regions were inserted.</p>
      ) : (
        <ul className="plain-list">
          {grantedBookmarks.map((bookmark) => (
            <li key={bookmark}>{bookmark}</li>
          ))}
        </ul>
      )}
      {unknownRole ? (
        <p className="warning-text">
          The permission service returned an unknown or unauthorized role. The sample applied zero
          editable regions.
        </p>
      ) : null}
      {missingBookmarks.length > 0 ? (
        <p className="warning-text">
          These backend bookmark names were not present in the document and were not granted:{' '}
          {missingBookmarks.join(', ')}.
        </p>
      ) : null}
    </section>
  );
}
