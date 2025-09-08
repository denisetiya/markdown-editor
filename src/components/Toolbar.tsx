import React from 'react';
import { 
  Bold, Italic, Code, Link, List, ListOrdered, 
  Quote, Heading1, Heading2, Heading3, Smile, GitBranch,
  Zap, Copy, Download, Upload, Hash, Undo, Redo,
  Minus as MinusIcon, Maximize2, Minimize2, Monitor, Square, Eye,
  Braces, Image, ChevronDown, Type, Layers, FileText
} from 'lucide-react';
import type { MainContentHandle } from './MainContent';

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
  mainContentRef: React.RefObject<MainContentHandle | null>;
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
  setShowModal,
  mainContentRef
}) => {
  // Function to convert selected text to bullet list
  const convertToBulletList = () => {
    if (mainContentRef.current) {
      mainContentRef.current.convertToBulletList();
    }
  };

  // Function to convert selected text to numbered list
  const convertToNumberedList = () => {
    if (mainContentRef.current) {
      mainContentRef.current.convertToNumberedList();
    }
  };

  // Function to toggle heading level 1
  const toggleHeading1 = () => {
    if (mainContentRef.current) {
      mainContentRef.current.toggleHeading(1);
    }
  };

  // Function to toggle heading level 2
  const toggleHeading2 = () => {
    if (mainContentRef.current) {
      mainContentRef.current.toggleHeading(2);
    }
  };

  // Function to toggle heading level 3
  const toggleHeading3 = () => {
    if (mainContentRef.current) {
      mainContentRef.current.toggleHeading(3);
    }
  };

  // Function to toggle bold formatting
  const toggleBold = () => {
    if (mainContentRef.current) {
      mainContentRef.current.toggleBold();
    }
  };

  // Function to toggle italic formatting
  const toggleItalic = () => {
    if (mainContentRef.current) {
      mainContentRef.current.toggleItalic();
    }
  };

  // Function to toggle code formatting
  const toggleCode = () => {
    if (mainContentRef.current) {
      mainContentRef.current.toggleCode();
    }
  };

  return (
    <>
      {/* Top Toolbar - Improved Layout */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 px-4 py-3 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left Section - File and Edit Operations */}
          <div className="flex flex-wrap items-center gap-4">
            {/* File Operations Group */}
            <div className="flex items-center gap-2">
              <div className="flex items-center px-2 py-1 bg-gray-700 rounded-lg">
                <FileText size={16} className="text-gray-400 mr-2" />
                <span className="text-xs text-gray-300 font-medium">File</span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={onCopyToClipboard}
                  className="px-3 py-2 text-sm rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 flex items-center transition-all duration-300 transform hover:scale-105 bg-gray-750 whitespace-nowrap shadow-md hover:shadow-lg"
                  title="Copy to Clipboard"
                >
                  <Copy size={16} />
                </button>
                <button
                  onClick={onDownloadMarkdown}
                  className="px-3 py-2 text-sm rounded-lg hover:bg-gradient-to-r hover:from-green-600 hover:to-teal-600 flex items-center transition-all duration-300 transform hover:scale-105 bg-gray-750 whitespace-nowrap shadow-md hover:shadow-lg"
                  title="Download MD"
                >
                  <Download size={16} />
                </button>
                <label className="px-3 py-2 text-sm rounded-lg hover:bg-gradient-to-r hover:from-yellow-600 hover:to-orange-600 flex items-center cursor-pointer transition-all duration-300 transform hover:scale-105 bg-gray-750 whitespace-nowrap shadow-md hover:shadow-lg">
                  <Upload size={16} />
                  <input
                    type="file"
                    accept=".md,.markdown"
                    onChange={onFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Edit Operations Group */}
            <div className="flex items-center gap-2 border-l border-gray-700 pl-4">
              <div className="flex items-center px-2 py-1 bg-gray-700 rounded-lg">
                <Type size={16} className="text-gray-400 mr-2" />
                <span className="text-xs text-gray-300 font-medium">Edit</span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={onUndo}
                  className="px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 flex items-center transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                  title="Undo (Ctrl+Z)"
                  disabled={!onUndo}
                >
                  <Undo size={16} />
                </button>
                <button
                  onClick={onRedo}
                  className="px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 flex items-center transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                  title="Redo (Ctrl+Y)"
                  disabled={!onRedo}
                >
                  <Redo size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Right Section - Formatting and View Controls */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Formatting Group */}
            <div className="flex items-center gap-2">
              <div className="flex items-center px-2 py-1 bg-gray-700 rounded-lg">
                <Bold size={16} className="text-gray-400 mr-2" />
                <span className="text-xs text-gray-300 font-medium">Format</span>
              </div>
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={toggleBold}
                  className="px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-pink-600 hover:to-rose-600 flex items-center transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                  title="Bold"
                >
                  <Bold size={16} />
                </button>
                <button
                  onClick={toggleItalic}
                  className="px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-pink-600 hover:to-rose-600 flex items-center transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                  title="Italic"
                >
                  <Italic size={16} />
                </button>
                <button
                  onClick={toggleCode}
                  className="px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-pink-600 hover:to-rose-600 flex items-center transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                  title="Code"
                >
                  <Code size={16} />
                </button>
                <button
                  onClick={() => onInsertText('[', '](url)')}
                  className="px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-pink-600 hover:to-rose-600 flex items-center transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                  title="Link"
                >
                  <Link size={16} />
                </button>
                
                {/* Heading Buttons - Moved out of dropdown */}
                <button
                  onClick={toggleHeading1}
                  className="px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-cyan-600 hover:to-blue-600 flex items-center transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                  title="Heading 1"
                >
                  <Heading1 size={16} />
                </button>
                <button
                  onClick={toggleHeading2}
                  className="px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-cyan-600 hover:to-blue-600 flex items-center transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                  title="Heading 2"
                >
                  <Heading2 size={16} />
                </button>
                <button
                  onClick={toggleHeading3}
                  className="px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-cyan-600 hover:to-blue-600 flex items-center transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                  title="Heading 3"
                >
                  <Heading3 size={16} />
                </button>
                
                {/* List Buttons - Moved out of dropdown */}
                <button
                  onClick={convertToBulletList}
                  className="px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-emerald-600 hover:to-green-600 flex items-center transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                  title="Bullet List"
                >
                  <List size={16} />
                </button>
                <button
                  onClick={convertToNumberedList}
                  className="px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-emerald-600 hover:to-green-600 flex items-center transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                  title="Numbered List"
                >
                  <ListOrdered size={16} />
                </button>
                
                {/* Blockquote Button - Moved out of dropdown */}
                <button
                  onClick={() => onInsertText('> ', '', true)}
                  className="px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-emerald-600 hover:to-green-600 flex items-center transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                  title="Blockquote"
                >
                  <Quote size={16} />
                </button>
                
                {/* Elements Dropdown (remaining items) */}
                <div className="relative group">
                  <button className="px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-amber-600 hover:to-yellow-600 flex items-center transition-all duration-300 transform hover:scale-105 bg-gray-750 whitespace-nowrap shadow-md hover:shadow-lg">
                    <Layers size={16} className="mr-1" />
                    <ChevronDown size={14} />
                  </button>
                  <div className="absolute left-0 mt-1 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 hidden group-hover:block">
                    <button
                      onClick={() => onInsertText('```\n', '\n```', true)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center transition-colors duration-200"
                    >
                      <Code size={16} className="mr-2" />
                      <span>Code Block</span>
                    </button>
                    <button
                      onClick={() => onInsertText('\n---\n', '', true)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center transition-colors duration-200"
                    >
                      <MinusIcon size={16} className="mr-2" />
                      <span>Horizontal Rule</span>
                    </button>
                    <button
                      onClick={() => setShowEmojiPicker(true)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center transition-colors duration-200"
                    >
                      <Smile size={16} className="mr-2" />
                      <span>Emoji</span>
                    </button>
                    <button
                      onClick={() => setShowModal('image')}
                      className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center transition-colors duration-200"
                    >
                      <Image size={16} className="mr-2" />
                      <span>Insert Image</span>
                    </button>
                    <button
                      onClick={() => setShowModal('table')}
                      className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center transition-colors duration-200"
                    >
                      <Hash size={16} className="mr-2" />
                      <span>Table</span>
                    </button>
                    <button
                      onClick={() => setShowModal('mermaid')}
                      className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center transition-colors duration-200"
                    >
                      <Zap size={16} className="mr-2" />
                      <span>Mermaid Diagram</span>
                    </button>
                    <button
                      onClick={() => setShowModal('folder')}
                      className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center transition-colors duration-200"
                    >
                      <GitBranch size={16} className="mr-2" />
                      <span>Folder Structure</span>
                    </button>
                    <button
                      onClick={() => setShowModal('code')}
                      className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center transition-colors duration-200"
                    >
                      <Braces size={16} className="mr-2" />
                      <span>Code Generator</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* View Controls Group */}
            <div className="flex items-center gap-2 border-l border-gray-700 pl-4">
              <div className="flex items-center px-2 py-1 bg-gray-700 rounded-lg">
                <Monitor size={16} className="text-gray-400 mr-2" />
                <span className="text-xs text-gray-300 font-medium">View</span>
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-red-600 hover:to-pink-600 flex items-center transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                  title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
                {isFullscreen && (
                  <>
                    <button
                      onClick={() => setFullscreenMode('editor')}
                      className={`px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg ${
                        fullscreenMode === 'editor' 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                          : 'hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600'
                      }`}
                      title="Editor only"
                    >
                      <Square size={16} />
                    </button>
                    <button
                      onClick={() => setFullscreenMode('preview')}
                      className={`px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg ${
                        fullscreenMode === 'preview' 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                          : 'hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600'
                      }`}
                      title="Preview only"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => setFullscreenMode('split')}
                      className={`px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg ${
                        fullscreenMode === 'split' 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                          : 'hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600'
                      }`}
                      title="Split view"
                    >
                      <Monitor size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Toolbar;