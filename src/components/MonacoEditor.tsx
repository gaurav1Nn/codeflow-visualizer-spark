
import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { gsap } from 'gsap';

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
}

export const MonacoEditor: React.FC<MonacoEditorProps> = ({
  value,
  onChange,
  language
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate editor appearance
    gsap.from(editorRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: "power3.out"
    });
  }, []);

  const handleEditorDidMount = (editor: any) => {
    // Configure editor theme and options
    editor.updateOptions({
      fontSize: 14,
      lineHeight: 20,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      theme: 'vs-dark'
    });
  };

  return (
    <div ref={editorRef} className="h-full rounded-lg overflow-hidden">
      <Editor
        height="100%"
        language={language}
        value={value}
        onChange={(val) => onChange(val || '')}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={{
          fontSize: 14,
          lineHeight: 20,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          padding: { top: 16, bottom: 16 }
        }}
      />
    </div>
  );
};
