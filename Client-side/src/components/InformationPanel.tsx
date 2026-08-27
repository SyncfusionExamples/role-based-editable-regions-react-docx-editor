export function InformationPanel() {
  return (
    <aside className="panel info-panel">
      <h2>Authorization boundary</h2>
      <p>
        Backend authorization is authoritative. This sample permission API only tells the editor
        which bookmarks to mark editable for a chosen demo profile.
      </p>
      <ul className="plain-list">
        <li>Do not treat browser restrict-editing as the only security control.</li>
        <li>The demonstration protection password is not an authorization secret.</li>
        <li>Exporting a DOCX does not mean the server re-authorized the file.</li>
      </ul>
    </aside>
  );
}
