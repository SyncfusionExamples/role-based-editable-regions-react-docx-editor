import type { DemoProfile } from '../document-protection/permissionTypes';

interface SwitchProfileDialogProps {
  profile: DemoProfile;
  onCancel: () => void;
  onDiscard: () => void;
  onExport: () => void;
}

export function SwitchProfileDialog({
  profile,
  onCancel,
  onDiscard,
  onExport,
}: SwitchProfileDialogProps) {
  return (
    <div className="dialog-backdrop" role="presentation">
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="switch-profile-title"
        aria-describedby="switch-profile-copy"
      >
        <h2 id="switch-profile-title">Unsaved edits in this working copy</h2>
        <p id="switch-profile-copy">
          Switching to {profile} reloads the original unprotected template, fetches that profile&apos;s
          permissions, and reapplies read-only protection. Previous editable ranges are not reused.
        </p>
        <div className="dialog-actions">
          <button type="button" className="button-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="button-secondary" onClick={onExport}>
            Export and switch
          </button>
          <button type="button" className="button-danger" onClick={onDiscard}>
            Discard and switch
          </button>
        </div>
      </div>
    </div>
  );
}
