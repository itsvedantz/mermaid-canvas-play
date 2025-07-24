import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Download, Copy, RotateCcw, FileText } from 'lucide-react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';

interface DiagramToolbarProps {
  onTemplateSelect: (template: string) => void;
  onClear: () => void;
  onExport: () => void;
  onCopyCode: (code: string) => void;
  currentCode: string;
}

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

export const DiagramToolbar = ({ 
  onTemplateSelect, 
  onClear, 
  onExport, 
  onCopyCode, 
  currentCode 
}: DiagramToolbarProps) => {

  const handleExportPNG = async () => {
    try {
      const diagramElement = document.querySelector('#mermaid-preview svg') as SVGElement;
      if (!diagramElement) {
        toast.error('No diagram to export');
        return;
      }

      // Create a container for the SVG
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.background = 'white';
      container.style.padding = '20px';
      container.appendChild(diagramElement.cloneNode(true));
      document.body.appendChild(container);

      const canvas = await html2canvas(container, {
        backgroundColor: '#ffffff',
        scale: 2
      });

      document.body.removeChild(container);

      // Download the image
      const link = document.createElement('a');
      link.download = 'mermaid-diagram.png';
      link.href = canvas.toDataURL();
      link.click();
      
      toast.success('Diagram exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export diagram');
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(currentCode);
      toast.success('Code copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-toolbar-background border-b border-border">
      <div className="flex items-center gap-2">
        <FileText className="w-4 h-4 text-muted-foreground" />
        <Select onValueChange={onTemplateSelect}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Choose template..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="flowchart">Flowchart</SelectItem>
            <SelectItem value="sequence">Sequence Diagram</SelectItem>
            <SelectItem value="class">Class Diagram</SelectItem>
            <SelectItem value="state">State Diagram</SelectItem>
            <SelectItem value="pie">Pie Chart</SelectItem>
            <SelectItem value="gantt">Gantt Chart</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyCode}
          className="gap-2"
        >
          <Copy className="w-4 h-4" />
          Copy Code
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportPNG}
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          Export PNG
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onClear}
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Clear
        </Button>
      </div>
    </div>
  );

  function getTemplate(key: string): string {
    return templates[key as keyof typeof templates] || '';
  }
};