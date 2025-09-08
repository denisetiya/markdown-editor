import React, { useState, useCallback, useRef, useEffect } from 'react';
import Toolbar from './Toolbar';
import MainContent from './MainContent';
import type { MainContentHandle } from './MainContent';
import EmojiPicker from './EmojiPicker';
import TableModal from './TableModal';
import FolderModal from './FolderModal';
import MermaidModal from './MermaidModal';
import CodeGeneratorModal from './CodeGeneratorModal';
import ImageModal from './ImageModal';

interface MarkdownEditorProps {
  isAutoSaveEnabled?: boolean;
}

interface FolderItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  expanded?: boolean;
  children?: FolderItem[];
}

// History item interface
interface HistoryItem {
  content: string;
  timestamp: number;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ isAutoSaveEnabled = true }) => {
  const [markdown, setMarkdown] = useState(() => {
    // Load content from localStorage on initial load
    const savedContent = localStorage.getItem('markdownContent');
    return savedContent || `# Welcome to GitHub Markdown Editor

This is a **powerful** markdown editor for creating GitHub documentation.

## Features
- **Bold** and *italic* text
- Headers (H1-H6)
- Lists and tables
- Code blocks
- Mermaid diagrams
- Emoji support
- And much more!

### Code Example
\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

### Mermaid Diagram
\`\`\`mermaid
graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Fix it]
    D --> B
\`\`\`
`;
  });
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenMode, setFullscreenMode] = useState<'editor' | 'preview' | 'split'>('split');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showModal, setShowModal] = useState<string | null>(null);
  const mainContentRef = useRef<MainContentHandle>(null);
  
  // History state for undo/redo
  const [history, setHistory] = useState<HistoryItem[]>([{ content: markdown, timestamp: Date.now() }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Modal states
  const [folderStructure, setFolderStructure] = useState<FolderItem[]>([
    { 
      id: '1', 
      name: 'src/', 
      type: 'folder', 
      expanded: true,
      children: [
        { 
          id: '2', 
          name: 'components/', 
          type: 'folder', 
          expanded: true,
          children: [
            { id: '3', name: 'Header.tsx', type: 'file' },
            { id: '4', name: 'Footer.tsx', type: 'file' }
          ]
        },
        { id: '5', name: 'utils/', type: 'folder', expanded: false, children: [
          { id: '6', name: 'helpers.ts', type: 'file' }
        ]},
        { id: '7', name: 'index.ts', type: 'file' }
      ]
    },
    { id: '8', name: 'package.json', type: 'file' },
    { id: '9', name: 'README.md', type: 'file' }
  ]);

  // Auto-save effect
  useEffect(() => {
    // Save content to localStorage only if auto-save is enabled
    if (isAutoSaveEnabled) {
      localStorage.setItem('markdownContent', markdown);
    }
  }, [markdown, isAutoSaveEnabled]);

  // Custom setMarkdown function that also updates history
  const setMarkdownWithHistory = useCallback((newMarkdown: string) => {
    setMarkdown(newMarkdown);
    
    // Update history only if we're at the latest point
    setHistory(prevHistory => {
      const newHistory = [...prevHistory];
      if (historyIndex === newHistory.length - 1) {
        // Limit history to 50 items to prevent memory issues
        const limitedHistory = newHistory.slice(-49);
        const newHistoryItem = { content: newMarkdown, timestamp: Date.now() };
        return [...limitedHistory, newHistoryItem];
      }
      return newHistory;
    });
    
    // Update history index if we're at the latest point
    setHistoryIndex(prevIndex => {
      if (prevIndex === history.length - 1) {
        return prevIndex + 1;
      }
      return prevIndex;
    });
  }, [historyIndex, history.length]);

  // Handle undo (Ctrl+Z)
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setMarkdown(history[newIndex].content);
      console.log('Undo performed, history index:', newIndex);
    } else {
      console.log('Cannot undo, already at earliest history point');
    }
  }, [history, historyIndex]);

  // Handle redo (Ctrl+Y)
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setMarkdown(history[newIndex].content);
      console.log('Redo performed, history index:', newIndex);
    } else {
      console.log('Cannot redo, already at latest history point');
    }
  }, [history, historyIndex]);

  // Keyboard event handler for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey)) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          console.log('Ctrl+Z detected, performing undo');
          undo();
        } else if ((e.key === 'z' && e.shiftKey) || e.key === 'y') {
          e.preventDefault();
          console.log('Ctrl+Y or Ctrl+Shift+Z detected, performing redo');
          redo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [undo, redo]);

  const insertTextAtCursor = useCallback((before: string, after: string = '', newLine: boolean = false) => {
    if (mainContentRef.current) {
      mainContentRef.current.insertTextAtCursor(before, after, newLine);
    } else {
      // Fallback: append to end
      let newText = before;
      
      if (newLine) {
        // Add newlines before and after if needed
        if (!newText.startsWith('\n')) {
          newText = '\n' + newText;
        }
        if (!newText.endsWith('\n')) {
          newText = newText + '\n';
        }
      }
      
      newText = newText + after;
      
      const newMarkdown = markdown + newText;
      setMarkdownWithHistory(newMarkdown);
    }
  }, [markdown, setMarkdownWithHistory]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdown);
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/markdown') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string || '';
        setMarkdown(content);
        // Reset history when loading new file
        setHistory([{ content, timestamp: Date.now() }]);
        setHistoryIndex(0);
      };
      reader.readAsText(file);
    }
    // Reset the input value to allow uploading the same file again
    event.target.value = '';
  };

  const handleEmojiInsert = (emoji: string) => {
    insertTextAtCursor(emoji, '');
  };

  const handleImageInsert = (altText: string, imageUrl: string) => {
    const imageMarkdown = `![${altText}](${imageUrl})`;
    insertTextAtCursor(imageMarkdown, '', true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Toolbar
        markdown={markdown}
        onInsertText={insertTextAtCursor}
        onCopyToClipboard={copyToClipboard}
        onDownloadMarkdown={downloadMarkdown}
        onFileUpload={handleFileUpload}
        onUndo={undo}
        onRedo={redo}
        isFullscreen={isFullscreen}
        setIsFullscreen={setIsFullscreen}
        fullscreenMode={fullscreenMode}
        setFullscreenMode={setFullscreenMode}
        setShowEmojiPicker={setShowEmojiPicker}
        setShowModal={setShowModal}
        mainContentRef={mainContentRef}
      />
      
      <MainContent
        ref={mainContentRef}
        markdown={markdown}
        setMarkdown={setMarkdownWithHistory}
        isFullscreen={isFullscreen}
        fullscreenMode={fullscreenMode === 'split' ? 'editor' : fullscreenMode}
      />

      {/* Modals */}
      {showModal === 'table' && (
        <TableModal 
          onClose={() => setShowModal(null)}
          onGenerate={(config) => {
            const { rows, cols, headers } = config;
            let table = '\n| ' + headers.join(' | ') + ' |\n';
            table += '|' + ' --- |'.repeat(cols) + '\n';
            
            for (let i = 0; i < rows - 1; i++) {
              table += '|' + ' Data |'.repeat(cols) + '\n';
            }
            table += '\n';
            
            insertTextAtCursor(table, '', true);
            setShowModal(null);
          }}
        />
      )}
      {showModal === 'folder' && (
        <FolderModal 
          onClose={() => setShowModal(null)}
          onGenerate={(structure) => {
            insertTextAtCursor(structure, '', true);
            setShowModal(null);
          }}
          initialFolderStructure={folderStructure}
          onFolderStructureChange={setFolderStructure}
        />
      )}
      {showModal === 'mermaid' && (
        <MermaidModal 
          onClose={() => setShowModal(null)}
          onGenerate={(diagram) => {
            insertTextAtCursor(diagram, '', true);
            setShowModal(null);
          }}
          initialConfig={{
            type: 'flowchart',
            direction: 'TD',
            theme: 'default',
            nodes: [
              { id: 'A', label: 'Start', shape: 'rect', color: '#374151' },
              { id: 'B', label: 'Process', shape: 'rect', color: '#374151' },
              { id: 'C', label: 'Decision', shape: 'diamond', color: '#374151' },
              { id: 'D', label: 'End', shape: 'rect', color: '#374151' }
            ],
            connections: [
              { from: 'A', to: 'B', label: 'Start Process', style: 'solid' },
              { from: 'B', to: 'C', label: 'Check', style: 'solid' },
              { from: 'C', to: 'D', label: 'Complete', style: 'solid' }
            ]
          }}
        />
      )}
      {showModal === 'code' && (
        <CodeGeneratorModal 
          onClose={() => setShowModal(null)}
          onGenerate={(code) => {
            insertTextAtCursor(code, '', true);
            setShowModal(null);
          }}
        />
      )}
      {showModal === 'image' && (
        <ImageModal 
          onClose={() => setShowModal(null)}
          onInsert={handleImageInsert}
        />
      )}
      
      {showEmojiPicker && (
        <EmojiPicker 
          onInsert={handleEmojiInsert}
          onClose={() => setShowEmojiPicker(false)}
        />
      )}
    </div>
  );
};

export default MarkdownEditor;