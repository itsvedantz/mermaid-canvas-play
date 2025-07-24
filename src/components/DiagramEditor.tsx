import { useState } from 'react';
import { CodeEditor } from './CodeEditor';
import { MermaidPreview } from './MermaidPreview';
import { DiagramToolbar } from './DiagramToolbar';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

const defaultCode = `flowchart TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Process A]
    B -->|No| D[Process B]
    C --> E[End]
    D --> E`;

const templates = {
  flowchart: `flowchart TD
    A[Start] --> B{Is it?}
    B -->|Yes| C[OK]
    C --> D[Rethink]
    D --> B
    B ---->|No| E[End]`,
  
  sequence: `sequenceDiagram
    participant Alice
    participant Bob
    Alice->>John: Hello John, how are you?
    loop Healthcheck
        John->>John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail!
    John-->>Alice: Great!
    John->>Bob: How about you?
    Bob-->>John: Jolly good!`,
  
  class: `classDiagram
    class Animal {
        +String name
        +int age
        +makeSound()
    }
    class Dog {
        +String breed
        +bark()
    }
    class Cat {
        +String color
        +meow()
    }
    Animal <|-- Dog
    Animal <|-- Cat`,
  
  state: `stateDiagram-v2
    [*] --> Still
    Still --> [*]
    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]`,
  
  pie: `pie title Pet Sales
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 15`,
  
  gantt: `gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2014-01-01, 30d
    Another task     :after a1  , 20d
    section Another
    Task in sec      :2014-01-12  , 12d
    another task      : 24d`
};

export const DiagramEditor = () => {
  const [code, setCode] = useState(defaultCode);

  const handleTemplateSelect = (template: string) => {
    const templateCode = templates[template as keyof typeof templates];
    if (templateCode) {
      setCode(templateCode);
    }
  };

  const handleClear = () => {
    setCode('');
  };

  const handleExport = () => {
    // This will be handled by the toolbar component
  };

  const handleCopyCode = (code: string) => {
    // This will be handled by the toolbar component
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-background">
      <div className="flex-none">
        <DiagramToolbar
          onTemplateSelect={handleTemplateSelect}
          onClear={handleClear}
          onExport={handleExport}
          onCopyCode={handleCopyCode}
          currentCode={code}
        />
      </div>
      
      <div className="flex-1 min-h-0">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full p-4">
              <CodeEditor value={code} onChange={setCode} />
            </div>
          </ResizablePanel>
          
          <ResizableHandle className="w-2 bg-border hover:bg-primary/20 transition-colors" />
          
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full p-4" id="mermaid-preview">
              <MermaidPreview code={code} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};