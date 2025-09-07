import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidRendererProps {
  chart: string;
  id?: string;
}

const MermaidRenderer: React.FC<MermaidRendererProps> = ({ chart, id }) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const chartId = useRef(`mermaid-${id || Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    // Initialize mermaid with dark theme configuration
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      securityLevel: 'loose',
      fontFamily: 'monospace',
      flowchart: {
        useMaxWidth: true,
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
        messageMargin: 35,
        mirrorActors: true,
        bottomMarginAdj: 1,
        useMaxWidth: true
      },
      gantt: {
        titleTopMargin: 25,
        barHeight: 20,
        fontSize: 11,
        gridLineStartPadding: 35,
        leftPadding: 75,
        topPadding: 50
      }
    });

    const renderChart = async () => {
      if (elementRef.current && chart && chart.trim()) {
        try {
          // Clear previous content
          elementRef.current.innerHTML = '';
          
          // Create a unique ID for each render to avoid conflicts
          const uniqueId = `${chartId.current}-${Date.now()}`;
          
          // Validate and render the mermaid chart
          const isValid = await mermaid.parse(chart.trim());
          
          if (isValid) {
            const { svg } = await mermaid.render(uniqueId, chart.trim());
            elementRef.current.innerHTML = svg;
            
            // Add styling to the SVG to control size
            const svgElement = elementRef.current.querySelector('svg');
            if (svgElement) {
              svgElement.style.maxWidth = '100%';
              svgElement.style.width = '100%';
              svgElement.style.height = 'auto';
              svgElement.style.maxHeight = '400px'; // Limit height
              svgElement.style.backgroundColor = 'transparent';
            }
          } else {
            // If chart is invalid, show error message
            elementRef.current.innerHTML = `
              <div class="text-red-600 bg-red-50 border border-red-200 rounded p-4">
                <strong>Invalid Mermaid syntax:</strong>
                <pre class="mt-2 text-sm">${chart}</pre>
              </div>
            `;
          }
        } catch (error) {
          console.error('Mermaid rendering error:', error);
          elementRef.current.innerHTML = `
            <div class="text-red-600 bg-red-50 border border-red-200 rounded p-4">
              <strong>Mermaid rendering error:</strong>
              <pre class="mt-2 text-sm">${chart}</pre>
              <p class="mt-2 text-xs text-gray-600">Error: ${error instanceof Error ? error.message : 'Unknown error'}</p>
            </div>
          `;
        }
      } else {
        // Show message when no chart content
        if (elementRef.current) {
          elementRef.current.innerHTML = `
            <div class="text-gray-500 bg-gray-50 border border-gray-200 rounded p-4">
              <p>No Mermaid chart content provided</p>
            </div>
          `;
        }
      }
    };

    renderChart();
  }, [chart]);

  return (
    <div className="mermaid-diagram bg-gray-900 border border-gray-700 p-4 rounded-lg my-4 overflow-x-auto">
      <div className="text-sm font-medium text-blue-400 mb-2 flex items-center">
        🧩 Mermaid Diagram
      </div>
      <div 
        ref={elementRef}
        className="mermaid-content custom-scrollbar"
        style={{ 
          minHeight: '100px',
          maxHeight: '400px',
          overflow: 'auto'
        }}
      />
    </div>
  );
};

export default MermaidRenderer;