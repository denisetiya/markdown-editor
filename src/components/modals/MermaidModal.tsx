import React, { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';

interface MermaidNode {
  id: string;
  label: string;
  shape: string;
  color?: string;
}

interface MermaidConnection {
  from: string;
  to: string;
  label: string;
  style: string;
}

interface MermaidConfig {
  type: string;
  direction?: string;
  theme?: string;
  nodes: MermaidNode[];
  connections: MermaidConnection[];
}

interface MermaidModalProps {
  onClose: () => void;
  onGenerate: (diagram: string) => void;
  initialConfig: MermaidConfig;
}

const MermaidModal: React.FC<MermaidModalProps> = ({ onClose, onGenerate, initialConfig }) => {
  const [mermaidConfig, setMermaidConfig] = useState<MermaidConfig>(initialConfig);

  const generateMermaidDiagram = () => {
    const { type, direction, nodes, connections, theme } = mermaidConfig;
    let diagram = `\`\`\`mermaid\n`;
    
    if (type === 'flowchart') {
      diagram += `graph ${direction || 'TD'}\n`;
      if (theme && theme !== 'default') {
        diagram += `%%{init: {'theme':'${theme}'}}%%\n`;
      }
      nodes.forEach(node => {
        let shape;
        switch(node.shape) {
          case 'diamond': shape = `{${node.label}}`; break;
          case 'circle': shape = `((${node.label}))`; break;
          case 'rounded': shape = `(${node.label})`; break;
          case 'stadium': shape = `([${node.label}])`; break;
          case 'subroutine': shape = `[[${node.label}]]`; break;
          case 'cylindrical': shape = `[(${node.label})]`; break;
          default: shape = `[${node.label}]`;
        }
        diagram += `    ${node.id}${shape}\n`;
        if (node.color) {
          diagram += `    style ${node.id} fill:${node.color}\n`;
        }
      });
      connections.forEach(conn => {
        let arrow;
        switch(conn.style) {
          case 'dotted': arrow = conn.label ? `-.->|${conn.label}|` : '-.->';
            break;
          case 'thick': arrow = conn.label ? `==>|${conn.label}|` : '==>';
            break;
          default: arrow = conn.label ? `-->|${conn.label}|` : '-->';
        }
        diagram += `    ${conn.from} ${arrow} ${conn.to}\n`;
      });
    } else if (type === 'sequence') {
      diagram += 'sequenceDiagram\n';
      if (theme && theme !== 'default') {
        diagram += `%%{init: {'theme':'${theme}'}}%%\n`;
      }
      nodes.forEach(node => {
        diagram += `    participant ${node.id} as ${node.label}\n`;
      });
      connections.forEach(conn => {
        const arrow = conn.style === 'dotted' ? '..>>' : '>>';
        diagram += `    ${conn.from}-${arrow}${conn.to}: ${conn.label || 'Message'}\n`;
      });
    } else if (type === 'gantt') {
      diagram += 'gantt\n';
      diagram += '    title Project Timeline\n';
      diagram += '    dateFormat YYYY-MM-DD\n';
      diagram += '    section Planning\n';
      nodes.forEach((node, index) => {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + (index * 7));
        const dateStr = startDate.toISOString().split('T')[0];
        diagram += `    ${node.label} :${node.id.toLowerCase()}, ${dateStr}, 7d\n`;
      });
    } else if (type === 'pie') {
      diagram += 'pie title Data Distribution\n';
      nodes.forEach((node) => {
        const value = Math.floor(Math.random() * 50) + 10;
        diagram += `    "${node.label}" : ${value}\n`;
      });
    }
    
    diagram += '\n```';
    onGenerate(diagram);
    onClose();
  };

  const addNode = () => {
    const newId = String.fromCharCode(65 + mermaidConfig.nodes.length);
    setMermaidConfig({
      ...mermaidConfig,
      nodes: [...mermaidConfig.nodes, { 
        id: newId, 
        label: `Node ${newId}`, 
        shape: 'rect',
        color: '#374151'
      }]
    });
  };

  const removeNode = (index: number) => {
    const nodeId = mermaidConfig.nodes[index].id;
    setMermaidConfig({
      ...mermaidConfig,
      nodes: mermaidConfig.nodes.filter((_, i) => i !== index),
      connections: mermaidConfig.connections.filter(conn => conn.from !== nodeId && conn.to !== nodeId)
    });
  };

  const addConnection = () => {
    if (mermaidConfig.nodes.length >= 2) {
      setMermaidConfig({
        ...mermaidConfig,
        connections: [...mermaidConfig.connections, { 
          from: mermaidConfig.nodes[0].id, 
          to: mermaidConfig.nodes[1].id, 
          label: '',
          style: 'solid'
        }]
      });
    }
  };

  const updateNode = (index: number, field: string, value: string) => {
    const newNodes = [...mermaidConfig.nodes];
    newNodes[index] = { ...newNodes[index], [field]: value };
    setMermaidConfig({ ...mermaidConfig, nodes: newNodes });
  };

  const updateConnection = (index: number, field: string, value: string) => {
    const newConnections = [...mermaidConfig.connections];
    newConnections[index] = { ...newConnections[index], [field]: value };
    setMermaidConfig({ ...mermaidConfig, connections: newConnections });
  };

  const presetTemplates = {
    basic_flow: {
      nodes: [
        { id: 'A', label: 'Start', shape: 'rect', color: '#10B981' },
        { id: 'B', label: 'Process', shape: 'rect', color: '#F59E0B' },
        { id: 'C', label: 'Decision', shape: 'diamond', color: '#EF4444' },
        { id: 'D', label: 'End', shape: 'rect', color: '#3B82F6' }
      ],
      connections: [
        { from: 'A', to: 'B', label: 'Begin', style: 'solid' },
        { from: 'B', to: 'C', label: 'Check', style: 'solid' },
        { from: 'C', to: 'D', label: 'Complete', style: 'solid' }
      ]
    },
    user_journey: {
      nodes: [
        { id: 'A', label: 'Login', shape: 'rect', color: '#10B981' },
        { id: 'B', label: 'Dashboard', shape: 'rect', color: '#F59E0B' },
        { id: 'C', label: 'Action', shape: 'diamond', color: '#EF4444' },
        { id: 'D', label: 'Result', shape: 'rect', color: '#3B82F6' }
      ],
      connections: [
        { from: 'A', to: 'B', label: 'Success', style: 'solid' },
        { from: 'B', to: 'C', label: 'Select', style: 'solid' },
        { from: 'C', to: 'D', label: 'Process', style: 'solid' }
      ]
    }
  };

  const loadTemplate = (templateName: keyof typeof presetTemplates) => {
    const template = presetTemplates[templateName];
    setMermaidConfig({
      ...mermaidConfig,
      nodes: template.nodes,
      connections: template.connections
    });
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-transparent flex items-center justify-center z-50">
      <div className="bg-gray-900 bg-opacity-90 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto m-4 border border-gray-700 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-100">Advanced Mermaid Diagram Builder</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-700 rounded text-gray-300">
            <X size={20} />
          </button>
        </div>
        <div className="space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Diagram Type</label>
              <select
                value={mermaidConfig.type}
                onChange={(e) => setMermaidConfig({...mermaidConfig, type: e.target.value})}
                className="w-full border rounded px-3 py-2 text-sm bg-gray-800 border-gray-700 text-gray-200"
              >
                <option value="flowchart" className="bg-gray-800 text-gray-200">Flowchart</option>
                <option value="sequence" className="bg-gray-800 text-gray-200">Sequence Diagram</option>
                <option value="gantt" className="bg-gray-800 text-gray-200">Gantt Chart</option>
                <option value="pie" className="bg-gray-800 text-gray-200">Pie Chart</option>
              </select>
            </div>
            
            {mermaidConfig.type === 'flowchart' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Direction</label>
                  <select
                    value={mermaidConfig.direction}
                    onChange={(e) => setMermaidConfig({...mermaidConfig, direction: e.target.value})}
                    className="w-full border rounded px-3 py-2 text-sm bg-gray-800 border-gray-700 text-gray-200"
                  >
                    <option value="TD" className="bg-gray-800 text-gray-200">Top to Bottom</option>
                    <option value="LR" className="bg-gray-800 text-gray-200">Left to Right</option>
                    <option value="BT" className="bg-gray-800 text-gray-200">Bottom to Top</option>
                    <option value="RL" className="bg-gray-800 text-gray-200">Right to Left</option>
                  </select>
                </div>
              </>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Theme</label>
            <select
              value={mermaidConfig.theme}
              onChange={(e) => setMermaidConfig({...mermaidConfig, theme: e.target.value})}
              className="w-full border rounded px-3 py-2 text-sm bg-gray-800 border-gray-700 text-gray-200"
            >
              <option value="default" className="bg-gray-800 text-gray-200">Default</option>
              <option value="dark" className="bg-gray-800 text-gray-200">Dark</option>
              <option value="forest" className="bg-gray-800 text-gray-200">Forest</option>
              <option value="neutral" className="bg-gray-800 text-gray-200">Neutral</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Quick Templates</label>
            <div className="flex space-x-2">
              <button
                onClick={() => loadTemplate('basic_flow')}
                className="px-3 py-1 bg-blue-800 text-gray-100 rounded hover:bg-blue-700 text-sm"
              >
                Basic Flow
              </button>
              <button
                onClick={() => loadTemplate('user_journey')}
                className="px-3 py-1 bg-green-800 text-gray-100 rounded hover:bg-green-700 text-sm"
              >
                User Journey
              </button>
            </div>
          </div>

          {(mermaidConfig.type === 'flowchart' || mermaidConfig.type === 'sequence') && (
            <>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-sm text-gray-300">Nodes</h4>
                  <button
                    onClick={addNode}
                    className="px-3 py-1 bg-green-700 text-gray-100 rounded hover:bg-green-600 text-sm"
                  >
                    <Plus size={14} className="inline mr-1" /> Add Node
                  </button>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {mermaidConfig.nodes.map((node, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-center">
                      <input
                        type="text"
                        value={node.label}
                        onChange={(e) => updateNode(index, 'label', e.target.value)}
                        className="col-span-4 border rounded px-2 py-1 text-sm bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500"
                        placeholder="Node label"
                      />
                      {mermaidConfig.type === 'flowchart' && (
                        <>
                          <select
                            value={node.shape}
                            onChange={(e) => updateNode(index, 'shape', e.target.value)}
                            className="col-span-3 border rounded px-2 py-1 text-sm bg-gray-800 border-gray-700 text-gray-200"
                          >
                            <option value="rect" className="bg-gray-800 text-gray-200">Rectangle</option>
                            <option value="diamond" className="bg-gray-800 text-gray-200">Diamond</option>
                            <option value="circle" className="bg-gray-800 text-gray-200">Circle</option>
                            <option value="rounded" className="bg-gray-800 text-gray-200">Rounded</option>
                            <option value="stadium" className="bg-gray-800 text-gray-200">Stadium</option>
                            <option value="subroutine" className="bg-gray-800 text-gray-200">Subroutine</option>
                            <option value="cylindrical" className="bg-gray-800 text-gray-200">Cylindrical</option>
                          </select>
                          <input
                            type="color"
                            value={node.color || '#374151'}
                            onChange={(e) => updateNode(index, 'color', e.target.value)}
                            className="col-span-2 border rounded px-1 py-1 bg-gray-800 border-gray-700"
                            title="Node color"
                          />
                        </>
                      )}
                      <button
                        onClick={() => removeNode(index)}
                        className="col-span-2 p-1 text-red-400 hover:bg-red-900 rounded text-sm"
                      >
                        <Minus size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-sm text-gray-300">Connections</h4>
                  <button
                    onClick={addConnection}
                    className="px-3 py-1 bg-blue-700 text-gray-100 rounded hover:bg-blue-600 text-sm"
                  >
                    <Plus size={14} className="inline mr-1" /> Add Connection
                  </button>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {mermaidConfig.connections.map((conn, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-center">
                      <select
                        value={conn.from}
                        onChange={(e) => updateConnection(index, 'from', e.target.value)}
                        className="col-span-3 border rounded px-2 py-1 text-sm bg-gray-800 border-gray-700 text-gray-200"
                      >
                        {mermaidConfig.nodes.map(node => (
                          <option key={node.id} value={node.id} className="bg-gray-800 text-gray-200">{node.label}</option>
                        ))}
                      </select>
                      <select
                        value={conn.to}
                        onChange={(e) => updateConnection(index, 'to', e.target.value)}
                        className="col-span-3 border rounded px-2 py-1 text-sm bg-gray-800 border-gray-700 text-gray-200"
                      >
                        {mermaidConfig.nodes.map(node => (
                          <option key={node.id} value={node.id} className="bg-gray-800 text-gray-200">{node.label}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={conn.label}
                        onChange={(e) => updateConnection(index, 'label', e.target.value)}
                        className="col-span-3 border rounded px-2 py-1 text-sm bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500"
                        placeholder="Label"
                      />
                      <select
                        value={conn.style}
                        onChange={(e) => updateConnection(index, 'style', e.target.value)}
                        className="col-span-2 border rounded px-2 py-1 text-sm bg-gray-800 border-gray-700 text-gray-200"
                      >
                        <option value="solid" className="bg-gray-800 text-gray-200">Solid</option>
                        <option value="dotted" className="bg-gray-800 text-gray-200">Dotted</option>
                        <option value="thick" className="bg-gray-800 text-gray-200">Thick</option>
                      </select>
                      <button
                        onClick={() => {
                          setMermaidConfig({
                            ...mermaidConfig,
                            connections: mermaidConfig.connections.filter((_, i) => i !== index)
                          });
                        }}
                        className="col-span-1 p-1 text-red-400 hover:bg-red-900 rounded"
                      >
                        <Minus size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          
          <div className="flex justify-end space-x-2 pt-4 border-t border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-700 rounded hover:bg-gray-700 text-sm text-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={generateMermaidDiagram}
              className="px-4 py-2 bg-blue-700 text-gray-100 rounded hover:bg-blue-600 text-sm"
            >
              Create Diagram
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MermaidModal;