import { useEffect, useRef, useState } from 'react';
import { adaptDocumentEditor } from '../document-protection/adaptDocumentEditor';
import type { RestrictEditingEditor } from '../document-protection/permissionTypes';
import { documentEditorServiceUrl } from '../services/config';
import { DocumentEditorContainerComponent, Ribbon, Toolbar } from '@syncfusion/ej2-react-documenteditor';
DocumentEditorContainerComponent.Inject(Toolbar, Ribbon);

interface ProtectedDocumentEditorProps {
  disabled: boolean;
  highlightEditableRanges: boolean;
  onReady: (editor: RestrictEditingEditor) => void;
  onContentChange: () => void;
}

export function ProtectedDocumentEditor({
  disabled,
  highlightEditableRanges,
  onReady,
  onContentChange,
}: ProtectedDocumentEditorProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<DocumentEditorContainerComponent>(null);
  const [height, setHeight] = useState('640px');

  useEffect(() => {
    const host = hostRef.current;
    if (!host) {
      return;
    }

    const observer = new ResizeObserver(() => {
      setHeight(`${Math.max(host.clientHeight, 480)}px`);
    });
    observer.observe(host);
    setHeight(`${Math.max(host.clientHeight, 480)}px`);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="editor-shell" ref={hostRef}>
      {disabled ? <div className="editor-disabled-surface" aria-hidden="true" /> : null}
      <DocumentEditorContainerComponent
        id="permissions-editor"
        ref={containerRef}
        height={height}
        enableToolbar
        toolbarMode="Ribbon" // Options: 'Ribbon' or 'Toolbar'
        serviceUrl={documentEditorServiceUrl}
        documentEditorSettings={{ highlightEditableRanges }}
        contentChange={() => {
          onContentChange();
        }}
        created={() => {
          const instance = containerRef.current;
          if (!instance?.documentEditor) {
            return;
          }

          onReady(adaptDocumentEditor(instance.documentEditor));
        }}
      />
    </div>
  );
}
