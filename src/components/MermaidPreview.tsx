import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { Card } from '@/components/ui/card';

interface MermaidPreviewProps {
  code: string;
}

export const MermaidPreview = ({ code }: MermaidPreviewProps) => {
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: {
        primaryColor: '#6366f1',
        primaryTextColor: '#1f2937',
        primaryBorderColor: '#4f46e5',
        lineColor: '#6b7280',
        secondaryColor: '#f3f4f6',
        tertiaryColor: '#ffffff',
        background: '#ffffff',
        secondaryBorderColor: '#d1d5db',
        tertiaryBorderColor: '#e5e7eb',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '14px'
      },
      flowchart: {
        htmlLabels: true,
        curve: 'basis'
      },
      sequence: {
        diagramMarginX: 50,
        diagramMarginY: 10,
        actorMargin: 50,
        width: 150,
        height: 65,
        boxMargin: 10,
        boxTextMargin: 5,
        noteMargin: 10,
        messageMargin: 35
      }
    });
  }, []);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!mermaidRef.current || !code.trim()) {
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = '<div class="flex items-center justify-center h-full text-muted-foreground">Enter Mermaid code to see the diagram</div>';
        }
        return;
      }

      try {
        // Clear previous content
        mermaidRef.current.innerHTML = '';
        
        // Generate unique ID
        const id = `mermaid-${Date.now()}`;
        
        // Validate and render
        const { svg } = await mermaid.render(id, code);
        mermaidRef.current.innerHTML = svg;
      } catch (error) {
        console.error('Mermaid rendering error:', error);
        mermaidRef.current.innerHTML = `
          <div class="flex items-center justify-center h-full p-4 text-destructive">
            <div class="text-center">
              <div class="font-semibold mb-2">Invalid Mermaid Syntax</div>
              <div class="text-sm">${error instanceof Error ? error.message : 'Unknown error'}</div>
            </div>
          </div>
        `;
      }
    };

    renderDiagram();
  }, [code]);

  return (
    <Card className="h-full bg-preview-background overflow-auto">
      <div 
        ref={mermaidRef} 
        className="w-full h-full flex items-center justify-center p-6"
      />
    </Card>
  );
};