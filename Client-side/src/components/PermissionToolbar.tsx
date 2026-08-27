import { DEMO_PROFILES, type DemoProfile } from '../document-protection/permissionTypes';

interface PermissionToolbarProps {
  profile: DemoProfile;
  grantedBookmarks: string[];
  busy: boolean;
  onProfileChange: (profile: DemoProfile) => void;
  onShowRestrictEditingPane: () => void;
  onDownload: () => void;
}

export function PermissionToolbar({
  profile,
  grantedBookmarks,
  busy,
  onProfileChange,
  onShowRestrictEditingPane,
  onDownload,
}: PermissionToolbarProps) {
  return (
    <section className="toolbar" aria-label="Permission controls">
      <div className="toolbar-group">
        <label htmlFor="profile-select">Active profile</label>
        <select
          id="profile-select"
          value={profile}
          disabled={busy}
          onChange={(event) => onProfileChange(event.target.value as DemoProfile)}
        >
          {DEMO_PROFILES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <div className="toolbar-group toolbar-bookmarks">
        <span id="granted-bookmarks-label">Editable bookmarks</span>
        <div className="bookmark-list" aria-labelledby="granted-bookmarks-label">
          {grantedBookmarks.length === 0 ? (
            <span className="muted">None — view only</span>
          ) : (
            grantedBookmarks.map((bookmark) => (
              <span key={bookmark} className="chip">
                {bookmark}
              </span>
            ))
          )}
        </div>
      </div>
      <div className="toolbar-actions">
        <button
          type="button"
          className="button-secondary"
          disabled={busy}
          onClick={() => onShowRestrictEditingPane()}
        >
          Show Restrict Editing Pane
        </button>
        <button type="button" className="button-primary" disabled={busy} onClick={onDownload}>
          Download DOCX
        </button>
      </div>
    </section>
  );
}
