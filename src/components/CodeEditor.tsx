import { Editor } from '@monaco-editor/react';
import { Card } from '@/components/ui/card';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const CodeEditor = ({ value, onChange }: CodeEditorProps) => {
  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '');
  };

  return (
    <Card className="h-full bg-editor-background border-editor-border overflow-hidden">
      <Editor
        height="100%"
        defaultLanguage="mermaid"
        value={value}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: 'JetBrains Mono, Fira Code, Monaco, Consolas, monospace',
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: true,
          wordWrap: 'on',
          padding: { top: 16, bottom: 16 },
          suggest: {
            showKeywords: true,
            showSnippets: true
          },
          quickSuggestions: {
            other: true,
            comments: true,
            strings: true
          }
        }}
        beforeMount={(monaco) => {
          // Define Mermaid language
          monaco.languages.register({ id: 'mermaid' });
          
          // Define syntax highlighting
          monaco.languages.setMonarchTokensProvider('mermaid', {
            tokenizer: {
              root: [
                [/^(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|journey|gitgraph|pie|gantt|requirementDiagram|C4Context|C4Container|C4Component|C4Dynamic|mindmap|timeline|quadrantChart|xychart-beta|sankey-beta)\b/, 'keyword'],
                [/^(subgraph|end)\s/, 'keyword'],
                [/\b(TD|TB|BT|RL|LR)\b/, 'keyword'],
                [/\b(participant|actor|note|activate|deactivate|loop|alt|else|opt|par|and|rect|autonumber)\b/, 'keyword'],
                [/\b(class|state|choice|fork|join)\b/, 'keyword'],
                [/-->|---|-\.-|-.->|==>|==|~~|~|:|\|/, 'operator'],
                [/\[[^\]]*\]/, 'string'],
                [/\([^)]*\)/, 'string'],
                [/\{[^}]*\}/, 'string'],
                [/"[^"]*"/, 'string'],
                [/'[^']*'/, 'string'],
                [/%%.*/, 'comment'],
                [/[A-Za-z][A-Za-z0-9_]*/, 'identifier']
              ]
            }
          });

          // Define theme
          monaco.editor.defineTheme('mermaid-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
              { token: 'keyword', foreground: '#6366f1', fontStyle: 'bold' },
              { token: 'string', foreground: '#10b981' },
              { token: 'comment', foreground: '#6b7280', fontStyle: 'italic' },
              { token: 'identifier', foreground: '#f59e0b' },
              { token: 'operator', foreground: '#ef4444' }
            ],
            colors: {
              'editor.background': '#1e1e2e',
              'editor.foreground': '#cdd6f4'
            }
          });
          
          monaco.editor.setTheme('mermaid-dark');
        }}
      />
    </Card>
  );
};