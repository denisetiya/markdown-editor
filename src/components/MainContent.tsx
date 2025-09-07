import { forwardRef, useImperativeHandle, useRef } from 'react';
import MarkdownPreview from './MarkdownPreview';

interface MainContentProps {
  markdown: string;
  setMarkdown: (markdown: string) => void;
  isFullscreen: boolean;
  fullscreenMode: 'editor' | 'preview';
}

export interface MainContentHandle {
  insertTextAtCursor: (before: string, after?: string, newLine?: boolean) => void;
}

const MainContent = forwardRef<MainContentHandle, MainContentProps>(({
  markdown,
  setMarkdown,
  isFullscreen,
  fullscreenMode
}, ref) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertTextAtCursor = (before: string, after: string = '', newLine: boolean = false) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);
    
    let replacement;
    if (newLine) {
      replacement = before + selectedText + after;
      if (start > 0 && markdown[start - 1] !== '\n') {
        replacement = '\n' + replacement;
      }
      if (end < markdown.length && markdown[end] !== '\n') {
        replacement = replacement + '\n';
      }
    } else {
      replacement = before + selectedText + after;
    }
    
    const newMarkdown = markdown.substring(0, start) + replacement + markdown.substring(end);
    setMarkdown(newMarkdown);
    
    // Focus back to textarea and set cursor position
    setTimeout(() => {
      const newPos = start + before.length + selectedText.length + after.length;
      textarea.focus();
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

  // Expose method to parent component
  useImperativeHandle(ref, () => ({
    insertTextAtCursor
  }));

  return (
    <div className={`flex ${isFullscreen ? 'h-[calc(100vh-130px)]' : 'h-[calc(100vh-200px)]'} transition-all duration-300`}>
      {/* Editor */}
      {(!isFullscreen || fullscreenMode === 'editor') && (
        <div className={`${isFullscreen ? 'w-full p-6' : 'w-1/2 p-6'} transition-all duration-300`}>
          <div className="h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
            <div className="bg-gray-800/80 backdrop-blur-sm px-4 py-2 border-b border-gray-700">
              <h2 className="text-sm font-medium text-gray-300">Editor</h2>
            </div>
            <textarea
              ref={textareaRef}
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="w-full h-[calc(100%-40px)] p-4 font-mono text-sm resize-none focus:ring-0 focus:outline-none bg-transparent text-gray-100 custom-scrollbar"
              placeholder="Start writing your markdown here..."
            />
          </div>
        </div>
      )}

      {/* Preview */}
      {(!isFullscreen || fullscreenMode === 'preview') && (
        <div className={`${isFullscreen ? 'w-full p-6' : 'w-1/2 p-6 border-l border-gray-700'} transition-all duration-300`}>
          <div className={`h-full ${isFullscreen ? '' : 'overflow-y-auto custom-scrollbar'}`}>
            <div className="h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
              <div className="bg-gray-800/80 backdrop-blur-sm px-4 py-2 border-b border-gray-700">
                <h2 className="text-sm font-medium text-gray-300">Preview</h2>
              </div>
              <div className="p-4 h-[calc(100%-40px)] overflow-y-auto custom-scrollbar">
                <MarkdownPreview markdown={markdown} />
                {/* Add extra margin at the bottom to prevent content from being cut off */}
                <div className="pb-16"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default MainContent;