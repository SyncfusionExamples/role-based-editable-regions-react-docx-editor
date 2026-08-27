import { documentationUrl, githubUrl } from '../services/config';
import type { DemoProfile } from '../document-protection/permissionTypes';

interface AppHeaderProps {
  profile: DemoProfile;
  protectionActive: boolean;
  statusLabel: string;
}

export function AppHeader({ profile, protectionActive, statusLabel }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">Syncfusion React DOCX Editor</p>
        <h1>Dynamic Document Permissions Sample</h1>
        <p className="lede">
          Load a clean DOCX template, apply backend-authorized bookmark ranges, and protect the rest
          of the document as read-only.
        </p>
      </div>
      <div className="header-meta">
        <span className="badge badge-role">{profile}</span>
        <span className={protectionActive ? 'badge badge-protected' : 'badge badge-idle'}>
          {protectionActive ? 'Read-only protection active' : statusLabel}
        </span>
        <nav className="header-links" aria-label="Sample references">
          <a href={documentationUrl} target="_blank" rel="noreferrer">
            Restrict editing docs
          </a>
          <a href={githubUrl} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
