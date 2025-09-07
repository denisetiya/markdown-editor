import React from 'react';
import { 
  Bold, Italic, Code, Link, List, ListOrdered, 
  Quote, Heading1, Heading2, Heading3, Smile, GitBranch,
  Zap, Copy, Download, Upload, Hash, Undo, Redo,
  Minus as MinusIcon, Maximize2, Minimize2, Monitor, Square, Eye,
  Braces
} from 'lucide-react';

interface ToolbarProps {
  markdown: string;
  onInsertText: (before: string, after?: string, newLine?: boolean) => void;
  onCopyToClipboard: () => void;
  onDownloadMarkdown: () => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  isFullscreen: boolean;
  setIsFullscreen: (isFullscreen: boolean) => void;
  fullscreenMode: 'editor' | 'preview' | 'split';
  setFullscreenMode: (mode: 'editor' | 'preview' | 'split') => void;
  setShowEmojiPicker: (show: boolean) => void;
  setShowModal: (modal: string | null) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onInsertText,
  onCopyToClipboard,
  onDownloadMarkdown,
  onFileUpload,
  onUndo,
  onRedo,
  isFullscreen,
  setIsFullscreen,
  fullscreenMode,
  setFullscreenMode,
  setShowEmojiPicker,
  setShowModal
}) => {
  return (
    <>
      {/* Top Toolbar */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-3 overflow-x-auto shadow-md">
        <div className="flex space-x-2 min-w-max">
          {/* File Operations */}
          <div className="flex space-x-2 mr-4">
            <button
              onClick={onCopyToClipboard}
              className="px-4 py-2 text-sm rounded-lg hover:bg-gray-700 flex items-center transition-all duration-200 transform hover:scale-105 bg-gray-750"
              title="Copy to Clipboard"
            >
              <Copy size={14} className="mr-2" />
              Copy
            </button>
            <button
              onClick={onDownloadMarkdown}
              className="px-4 py-2 text-sm rounded-lg hover:bg-gray-700 flex items-center transition-all duration-200 transform hover:scale-105 bg-gray-750"
              title="Download MD"
            >
              <Download size={14} className="mr-2" />
              Download
            </button>
            <label className="px-4 py-2 text-sm rounded-lg hover:bg-gray-700 flex items-center cursor-pointer transition-all duration-200 transform hover:scale-105 bg-gray-750">
              <Upload size={14} className="mr-2" />
              Upload
              <input
                type="file"
                accept=".md,.markdown"
                onChange={onFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Undo/Redo */}
          <div className="flex space-x-1 border-l border-gray-700 pl-4">
            <button
              onClick={onUndo}
              className="px-3 py-2 rounded-lg hover:bg-gray-700 flex items-center transition-all duration-200 transform hover:scale-105"
              title="Undo (Ctrl+Z)"
              disabled={!onUndo}
            >
              <Undo size={14} />
            </button>
            <button
              onClick={onRedo}
              className="px-3 py-2 rounded-lg hover:bg-gray-700 flex items-center transition-all duration-200 transform hover:scale-105"
              title="Redo (Ctrl+Y)"
              disabled={!onRedo}
            >
              <Redo size={14} />
            </button>
          </div>

          {/* Text Formatting */}
          <div className="flex space-x-1 border-l border-gray-700 pl-4">
            <button
              onClick={() => onInsertText('**', '**')}
              className="px-3 py-2 rounded-lg hover:bg-gray-700 flex items-center transition-all duration-200 transform hover:scale-105"
              title="Bold"
            >
              <Bold size={14} />
            </button>
            <button
              onClick={() => onInsertText('*', '*')}
              className="px-3 py-2 rounded-lg hover:bg-gray-700 flex items-center transition-all duration-200 transform hover:scale-105"
              title="Italic"
            >
              <Italic size={14} />
            </button>
            <button
              onClick={() => onInsertText('`', '`')}
              className="px-3 py-2 rounded-lg hover:bg-gray-700 flex items-center transition-all duration-200 transform hover:scale-105"
              title="Code"
            >
              <Code size={14} />
            </button>
            <button
              onClick={() => onInsertText('[', '](url)')}
              className="px-3 py-2 rounded-lg hover:bg-gray-700 flex items-center transition-all duration-200 transform hover:scale-105"
              title="Link"
            >
              <Link size={14} />
            </button>
          </div>

          {/* Headers */}
          <div className="flex space-x-1 border-l border-gray-700 pl-4">
            <button
              onClick={() => onInsertText('# ', '', true)}
              className="px-3 py-2 text-sm rounded-lg hover:bg-gray-700 flex items-center transition-all duration-200 transform hover:scale-105"
              title="Heading 1"
            >
              <Heading1 size={14} className="mr-1" />
              H1
            </button>
            <button
              onClick={() => onInsertText('## ', '', true)}
              className="px-3 py-2 text-sm rounded-lg hover:bg-gray-700 flex items-center transition-all duration-200 transform hover:scale-105"
              title="Heading 2"
            >
              <Heading2 size={14} className="mr-1" />
              H2
            </button>
            <button
              onClick={() => onInsertText('### ', '', true)}
              className="px-3 py-2 text-sm rounded-lg hover:bg-gray-700 flex items-center transition-all duration-200 transform hover:scale-105"
              title="Heading 3"
            >
              <Heading3 size={14} className="mr-1" />
              H3
            </button>
          </div>

          {/* Lists */}
          <div className="flex space-x-1 border-l border-gray-700 pl-4">
            <button
              onClick={() => onInsertText('- ', '', true)}
              className="px-3 py-2 rounded-lg hover:bg-gray-700 flex items-center transition-all duration-200 transform hover:scale-105"
              title="Bullet List"
            >
              <List size={14} />
            </button>
            <button
              onClick={() => onInsertText('1. ', '', true)}
              className="px-3 py-2 rounded-lg hover:bg-gray-700 flex items-center transition-all duration-200 transform hover:scale-105"
              title="Numbered List"
            >
              <ListOrdered size={14} />
            </button>
            <button
              onClick={() => onInsertText('> ', '', true)}
              className="px-3 py-2 rounded-lg hover:bg-gray-700 flex items-center transition-all duration-200 transform hover:scale-105"
              title="Blockquote"
            >
              <Quote size={14} />
            </button>
          </div>

          {/* Code & Horizontal Rule */}
          <div className="flex space-x-1 border-l border-gray-700 pl-4">
            <button
              onClick={() => onInsertText('```\n', '\n```', true)}
              className="px-3 py-2 rounded-lg hover:bg-gray-700 flex items-center transition-all duration-200 transform hover:scale-105"
              title="Code Block"
            >
              <Code size={14} />
            </button>
            <button
              onClick={() => onInsertText('\n---\n', '', true)}
              className="px-3 py-2 rounded-lg hover:bg-gray-700 flex items-center transition-all duration-200 transform hover:scale-105"
              title="Horizontal Rule"
            >
              <MinusIcon size={14} />
            </button>
          </div>

          {/* Special Elements */}
          <div className="flex space-x-1 border-l border-gray-700 pl-4">
            <button
              onClick={() => setShowEmojiPicker(true)}
              className="px-3 py-2 rounded-lg hover:bg-gray-700 flex items-center transition-all duration-200 transform hover:scale-105"
              title="Emoji"
            >
              <Smile size={14} />
            </button>
            <button
              onClick={() => setShowModal('table')}
              className="px-3 py-2 rounded-lg hover:bg-gray-700 flex items-center transition-all duration-200 transform hover:scale-105"
              title="Table"
            >
              <Hash size={14} />
            </button>
            <button
              onClick={() => setShowModal('mermaid')}
              className="px-3 py-2 rounded-lg hover:bg-gray-700 flex items-center transition-all duration-200 transform hover:scale-105"
              title="Mermaid Diagram"
            >
              <Zap size={14} />
            </button>
            <button
              onClick={() => setShowModal('folder')}
              className="px-3 py-2 rounded-lg hover:bg-gray-700 flex items-center transition-all duration-200 transform hover:scale-105"
              title="Folder Structure"
            >
              <GitBranch size={14} />
            </button>
            <button
              onClick={() => setShowModal('code')}
              className="px-3 py-2 rounded-lg hover:bg-gray-700 flex items-center transition-all duration-200 transform hover:scale-105"
              title="Code Generator"
            >
              <Braces size={14} />
            </button>
          </div>

          {/* Fullscreen Controls */}
          <div className="flex space-x-1 border-l border-gray-700 pl-4">
            <button 
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="px-3 py-2 rounded-lg hover:bg-gray-700 flex items-center transition-all duration-200 transform hover:scale-105"
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
            {isFullscreen && (
              <div className="flex space-x-1 ml-2">
                <button
                  onClick={() => setFullscreenMode('editor')}
                  className={`px-3 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                    fullscreenMode === 'editor' 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                      : 'hover:bg-gray-700'
                  }`}
                  title="Editor only"
                >
                  <Square size={14} />
                </button>
                <button
                  onClick={() => setFullscreenMode('preview')}
                  className={`px-3 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                    fullscreenMode === 'preview' 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                      : 'hover:bg-gray-700'
                  }`}
                  title="Preview only"
                >
                  <Eye size={14} />
                </button>
                <button
                  onClick={() => setFullscreenMode('split')}
                  className={`px-3 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                    fullscreenMode === 'split' 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                      : 'hover:bg-gray-700'
                  }`}
                  title="Split view"
                >
                  <Monitor size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Toolbar;