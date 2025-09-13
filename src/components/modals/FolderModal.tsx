import React, { useState } from 'react';
import { X, Plus, Minus, ChevronRight, ChevronDown, Folder, File } from 'lucide-react';

interface FolderItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  expanded?: boolean;
  children?: FolderItem[];
}

interface FolderModalProps {
  onClose: () => void;
  onGenerate: (structure: string) => void;
  initialFolderStructure: FolderItem[];
  onFolderStructureChange?: (newStructure: FolderItem[]) => void;
}

const FolderModal: React.FC<FolderModalProps> = ({ onClose, onGenerate, initialFolderStructure, onFolderStructureChange }) => {
  const [folderStructure, setFolderStructure] = useState<FolderItem[]>(initialFolderStructure);
  const [newItemName, setNewItemName] = useState('');
  const [newItemType, setNewItemType] = useState('file');
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const renderFolderStructure = (items: FolderItem[], level: number = 0): string => {
    let structure = '';
    const indent = '  '.repeat(level);
    
    items.forEach((item: FolderItem, index: number) => {
      const isLast = index === items.length - 1;
      const prefix = level === 0 ? '' : (isLast ? '└── ' : '├── ');
      structure += indent + prefix + item.name + '\n';
      
      if (item.children && item.children.length > 0 && (item.expanded !== false)) {
        const childIndent = level === 0 ? '' : (isLast ? '    ' : '│   ');
        const childStructure = renderFolderStructure(item.children, level + 1);
        structure += childStructure.split('\n').map(line => 
          line ? indent + childIndent + line.substring(indent.length) : line
        ).join('\n');
      }
    });
    
    return structure;
  };

  const generateFolderStructure = () => {
    const structure = `## Project Structure
\`\`\`
${renderFolderStructure(folderStructure).trim()}
\`\`\``;
    onGenerate(structure);
    onClose();
  };



  const addItemToFolder = (items: FolderItem[], parentId: string, newItem: FolderItem): FolderItem[] => {
    return items.map((item: FolderItem) => {
      if (item.id === parentId) {
        return {
          ...item,
          children: [...(item.children || []), newItem],
          expanded: true
        };
      }
      if (item.children) {
        return {
          ...item,
          children: addItemToFolder(item.children, parentId, newItem)
        };
      }
      return item;
    });
  };

  const removeItemById = (items: FolderItem[], idToRemove: string): FolderItem[] => {
    return items.filter((item: FolderItem) => item.id !== idToRemove)
      .map((item: FolderItem) => ({
        ...item,
        children: item.children ? removeItemById(item.children, idToRemove) : undefined
      }));
  };

  const toggleFolderExpansion = (items: FolderItem[], folderId: string): FolderItem[] => {
    return items.map((item: FolderItem) => {
      if (item.id === folderId) {
        return { ...item, expanded: !item.expanded };
      }
      if (item.children) {
        return {
          ...item,
          children: toggleFolderExpansion(item.children, folderId)
        };
      }
      return item;
    });
  };

  const addNewItem = () => {
    if (newItemName.trim()) {
      const newItem: FolderItem = {
        id: generateId(),
        name: newItemName + (newItemType === 'folder' ? '/' : ''),
        type: newItemType as 'file' | 'folder',
        expanded: true,
        children: newItemType === 'folder' ? [] : undefined
      };
      
      let newStructure: FolderItem[];
      if (selectedParentId) {
        newStructure = addItemToFolder(folderStructure, selectedParentId, newItem);
      } else {
        newStructure = [...folderStructure, newItem];
      }
      
      setFolderStructure(newStructure);
      if (onFolderStructureChange) {
        onFolderStructureChange(newStructure);
      }
      
      setNewItemName('');
      setSelectedParentId(null);
    }
  };

  const removeItem = (id: string) => {
    const newStructure = removeItemById(folderStructure, id);
    setFolderStructure(newStructure);
    if (onFolderStructureChange) {
      onFolderStructureChange(newStructure);
    }
  };

  const toggleFolder = (id: string) => {
    const newStructure = toggleFolderExpansion(folderStructure, id);
    setFolderStructure(newStructure);
    if (onFolderStructureChange) {
      onFolderStructureChange(newStructure);
    }
  };

  const renderFolderTree = (items: FolderItem[], level: number = 0): React.ReactNode => {
    return items.map(item => (
      <div key={item.id} style={{ marginLeft: level * 20 }}>
        <div className="flex items-center justify-between bg-gray-800 p-2 rounded border border-gray-700 mb-1">
          <div className="flex items-center">
            {item.type === 'folder' && (
              <button
                onClick={() => toggleFolder(item.id)}
                className="mr-1 p-0.5 hover:bg-gray-700 rounded text-gray-300"
              >
                {item.expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
            )}
            {item.type === 'folder' ? 
              <Folder size={16} className="mr-2 text-blue-400" /> : 
              <File size={16} className="mr-2 text-gray-400" />
            }
            <span className="text-sm text-gray-200">{item.name}</span>
          </div>
          <div className="flex items-center space-x-1">
            {item.type === 'folder' && (
              <button
                onClick={() => setSelectedParentId(item.id)}
                className="p-1 text-green-400 hover:bg-green-900 rounded text-xs"
                title="Add to this folder"
              >
                <Plus size={12} />
              </button>
            )}
            <button
              onClick={() => removeItem(item.id)}
              className="p-1 text-red-400 hover:bg-red-900 rounded"
            >
              <Minus size={12} />
            </button>
          </div>
        </div>
        {item.children && item.expanded && renderFolderTree(item.children, level + 1)}
      </div>
    ));
  };

  const getAllFolders = (items: FolderItem[], result: FolderItem[] = []): FolderItem[] => {
    items.forEach((item: FolderItem) => {
      if (item.type === 'folder') {
        result.push(item);
        if (item.children) {
          getAllFolders(item.children, result);
        }
      }
    });
    return result;
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-transparent flex items-center justify-center z-50">
      <div className="bg-gray-900 bg-opacity-90 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto m-4 border border-gray-700 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-100">Folder Structure Generator</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-700 rounded text-gray-300">
            <X size={20} />
          </button>
        </div>
        <div className="space-y-4">
          <div className="border rounded p-4 max-h-48 overflow-y-auto bg-gray-900 border-gray-700">
            <pre className="text-sm font-mono text-gray-200">{renderFolderStructure(folderStructure)}</pre>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Item name"
              className="border rounded px-3 py-2 text-sm bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500"
            />
            <select
              value={newItemType}
              onChange={(e) => setNewItemType(e.target.value)}
              className="border rounded px-3 py-2 text-sm bg-gray-800 border-gray-700 text-gray-200"
            >
              <option value="file" className="bg-gray-800 text-gray-200">File</option>
              <option value="folder" className="bg-gray-800 text-gray-200">Folder</option>
            </select>
            <select
              value={selectedParentId || ''}
              onChange={(e) => setSelectedParentId(e.target.value || null)}
              className="border rounded px-3 py-2 text-sm bg-gray-800 border-gray-700 text-gray-200"
            >
              <option value="" className="bg-gray-800 text-gray-200">Root Level</option>
              {getAllFolders(folderStructure).map(folder => (
                <option key={folder.id} value={folder.id} className="bg-gray-800 text-gray-200">
                  {folder.name.replace('/', '')}
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={addNewItem}
            className="w-full px-3 py-2 bg-green-700 text-gray-100 rounded hover:bg-green-600 text-sm"
          >
            <Plus size={16} className="inline mr-1" /> Add Item
          </button>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            <h4 className="font-medium text-sm text-gray-200">Current Structure:</h4>
            {renderFolderTree(folderStructure)}
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-700 rounded hover:bg-gray-700 text-sm text-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={generateFolderStructure}
              className="px-4 py-2 bg-blue-700 text-gray-100 rounded hover:bg-blue-600 text-sm"
            >
              Generate Structure
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FolderModal;