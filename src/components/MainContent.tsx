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
  convertToBulletList: () => void;
  convertToNumberedList: () => void;
  toggleHeading: (level: number) => void;
  toggleBold: () => void;
  toggleItalic: () => void;
  toggleCode: () => void;
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

  // Function to detect if a line is a bullet list item
  const isBulletListItem = (line: string): boolean => {
    return /^\s*-\s+.*/.test(line);
  };

  // Function to detect if a line is a numbered list item
  const isNumberedListItem = (line: string): boolean => {
    return /^\s*\d+\.\s+.*/.test(line);
  };

  // Function to remove bullet list markers
  const removeBulletListMarkers = (lines: string[]): string[] => {
    return lines.map(line => {
      if (isBulletListItem(line)) {
        return line.replace(/^\s*-\s+/, '');
      }
      return line;
    });
  };

  // Function to remove numbered list markers
  const removeNumberedListMarkers = (lines: string[]): string[] => {
    return lines.map(line => {
      if (isNumberedListItem(line)) {
        return line.replace(/^\s*\d+\.\s+/, '');
      }
      return line;
    });
  };

  // Function to detect if all selected lines are bullet list items
  const areAllBulletListItems = (lines: string[]): boolean => {
    return lines.length > 0 && lines.every(line => line.trim() === '' || isBulletListItem(line));
  };

  // Function to detect if all selected lines are numbered list items
  const areAllNumberedListItems = (lines: string[]): boolean => {
    return lines.length > 0 && lines.every(line => line.trim() === '' || isNumberedListItem(line));
  };

  // Function to convert selected text to bullet list
  const convertToBulletList = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);

    if (!selectedText) {
      // If no text is selected, just insert a bullet point
      insertTextAtCursor('- ', '', true);
      return;
    }

    // Split selected text into lines
    const lines = selectedText.split('\n');
    
    // Check if we're converting from numbered list to bullet list
    const isCurrentlyNumberedList = areAllNumberedListItems(lines);
    
    // Check if we're toggling off an existing bullet list
    const isCurrentlyBulletList = areAllBulletListItems(lines);
    
    let bulletedLines;
    if (isCurrentlyBulletList) {
      // Toggle off: remove bullet list markers
      bulletedLines = removeBulletListMarkers(lines);
    } else if (isCurrentlyNumberedList) {
      // Convert numbered list to bullet list
      bulletedLines = lines.map(line => {
        if (isNumberedListItem(line)) {
          // Replace numbered list marker with bullet marker
          return line.replace(/^\s*\d+\.\s+/, '- ');
        }
        return line;
      });
    } else {
      // Add bullet points to each line
      bulletedLines = lines.map(line => `- ${line}`);
    }
    
    const bulletedText = bulletedLines.join('\n');

    // Add newlines before and after if needed
    let replacement = bulletedText;
    if (start > 0 && markdown[start - 1] !== '\n') {
      replacement = '\n' + replacement;
    }
    if (end < markdown.length && markdown[end] !== '\n') {
      replacement = replacement + '\n';
    }

    const newMarkdown = markdown.substring(0, start) + replacement + markdown.substring(end);
    setMarkdown(newMarkdown);

    // Focus back to textarea
    setTimeout(() => {
      textarea.focus();
      // Set selection to after the bulleted text
      const newPos = start + replacement.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

  // Function to convert selected text to numbered list
  const convertToNumberedList = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);

    if (!selectedText) {
      // If no text is selected, just insert a numbered point
      insertTextAtCursor('1. ', '', true);
      return;
    }

    // Split selected text into lines
    const lines = selectedText.split('\n');
    
    // Check if we're converting from bullet list to numbered list
    const isCurrentlyBulletList = areAllBulletListItems(lines);
    
    // Check if we're toggling off an existing numbered list
    const isCurrentlyNumberedList = areAllNumberedListItems(lines);
    
    let numberedLines;
    if (isCurrentlyNumberedList) {
      // Toggle off: remove numbered list markers
      numberedLines = removeNumberedListMarkers(lines);
    } else if (isCurrentlyBulletList) {
      // Convert bullet list to numbered list
      numberedLines = lines.map((line, index) => {
        if (isBulletListItem(line)) {
          // Replace bullet list marker with numbered marker
          return line.replace(/^\s*-\s+/, `${index + 1}. `);
        }
        return line;
      });
    } else {
      // Add numbered points to each line
      numberedLines = lines.map((line, index) => `${index + 1}. ${line}`);
    }
    
    const numberedText = numberedLines.join('\n');

    // Add newlines before and after if needed
    let replacement = numberedText;
    if (start > 0 && markdown[start - 1] !== '\n') {
      replacement = '\n' + replacement;
    }
    if (end < markdown.length && markdown[end] !== '\n') {
      replacement = replacement + '\n';
    }

    const newMarkdown = markdown.substring(0, start) + replacement + markdown.substring(end);
    setMarkdown(newMarkdown);

    // Focus back to textarea
    setTimeout(() => {
      textarea.focus();
      // Set selection to after the numbered text
      const newPos = start + replacement.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

  // Function to detect heading level of a line
  const getHeadingLevel = (line: string): number => {
    // Match heading pattern that may include inline formatting
    // This regex matches lines that start with optional whitespace, 1-6 # characters, a space, and the rest of the line
    const match = line.match(/^(\s*)(#{1,6})\s(.*)$/);
    return match ? match[2].length : 0;
  };

  // Function to remove heading markers from lines
  const removeHeadingMarkers = (lines: string[]): string[] => {
    return lines.map(line => {
      // This regex matches lines that start with optional whitespace, 1-6 # characters, a space, and the rest of the line
      const match = line.match(/^(\s*)(#{1,6})\s(.*)$/);
      if (match) {
        // Preserve leading whitespace and return content without heading markers
        return match[1] + match[3];
      }
      return line;
    });
  };

  // Function to check if all non-empty lines have the same heading level
  const areAllSameHeadingLevel = (lines: string[], level: number): boolean => {
    const nonEmptyLines = lines.filter(line => line.trim() !== '');
    if (nonEmptyLines.length === 0) return false;
    
    // Check if all non-empty lines have the specified heading level
    return nonEmptyLines.every(line => getHeadingLevel(line) === level);
  };

  // Function to toggle heading on selected text
  const toggleHeading = (level: number) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);

    if (!selectedText) {
      // If no text is selected, insert heading marker
      const headingMarker = '#'.repeat(level) + ' ';
      insertTextAtCursor(headingMarker, '', true);
      return;
    }

    // Split selected text into lines
    const lines = selectedText.split('\n');
    
    // Check if all non-empty lines have the same heading level as requested
    const isAlreadySameHeadingLevel = areAllSameHeadingLevel(lines, level);
    
    let headedLines;
    if (isAlreadySameHeadingLevel && level > 0) {
      // Toggle off: remove heading markers (only if we're actually toggling a heading level)
      headedLines = removeHeadingMarkers(lines);
    } else {
      // Apply heading: either convert existing headings or add new ones
      headedLines = lines.map(line => {
        if (line.trim() === '') {
          return line; // Keep empty lines as they are
        }
        
        const currentLevel = getHeadingLevel(line);
        
        if (currentLevel > 0) {
          // Line already has a heading, replace it with the new level
          const content = line.replace(/^\s*#{1,6}\s/, '');
          // Preserve leading whitespace if any
          const leadingWhitespace = line.match(/^(\s*)/)?.[1] || '';
          return leadingWhitespace + '#'.repeat(level) + ' ' + content;
        } else {
          // Line has no heading, add one
          // Preserve leading whitespace if any
          const leadingWhitespace = line.match(/^(\s*)/)?.[1] || '';
          const content = line.trimStart();
          return leadingWhitespace + '#'.repeat(level) + ' ' + content;
        }
      });
    }
    
    const headedText = headedLines.join('\n');

    // Add newlines before and after if needed
    let replacement = headedText;
    if (start > 0 && markdown[start - 1] !== '\n') {
      replacement = '\n' + replacement;
    }
    if (end < markdown.length && markdown[end] !== '\n') {
      replacement = replacement + '\n';
    }

    const newMarkdown = markdown.substring(0, start) + replacement + markdown.substring(end);
    setMarkdown(newMarkdown);

    // Focus back to textarea
    setTimeout(() => {
      textarea.focus();
      // Set selection to cover the modified text
      const newPos = start + replacement.length;
      textarea.setSelectionRange(start, newPos);
    }, 0);
  };

  // Function to check if selected text is already bold
  const isTextBold = (text: string): boolean => {
    // Check if text starts and ends with ** (but not *** which is italic)
    return text.startsWith('**') && text.endsWith('**') && !text.startsWith('***') && !text.endsWith('***');
  };

  // Function to check if selected text is already italic
  const isTextItalic = (text: string): boolean => {
    // Check if text starts and ends with * (but not ** which is bold)
    return text.startsWith('*') && text.endsWith('*') && !text.startsWith('**') && !text.endsWith('**');
  };

  // Function to check if selected text is already inline code
  const isTextCode = (text: string): boolean => {
    // Check if text starts and ends with `
    return text.startsWith('`') && text.endsWith('`');
  };

  // Function to remove bold formatting
  const removeBoldFormatting = (text: string): string => {
    if (isTextBold(text)) {
      return text.slice(2, -2); // Remove ** from both ends
    }
    return text;
  };

  // Function to remove italic formatting
  const removeItalicFormatting = (text: string): string => {
    if (isTextItalic(text)) {
      return text.slice(1, -1); // Remove * from both ends
    }
    return text;
  };

  // Function to remove code formatting
  const removeCodeFormatting = (text: string): string => {
    if (isTextCode(text)) {
      return text.slice(1, -1); // Remove ` from both ends
    }
    return text;
  };

  // Function to toggle bold formatting
  const toggleBold = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);

    if (!selectedText) {
      // If no text is selected, insert bold markers
      insertTextAtCursor('**', '**');
      return;
    }

    // Check if text is already bold
    if (isTextBold(selectedText)) {
      // Remove bold formatting
      const unformattedText = removeBoldFormatting(selectedText);
      
      const newMarkdown = markdown.substring(0, start) + unformattedText + markdown.substring(end);
      setMarkdown(newMarkdown);
      
      // Focus back to textarea and adjust selection
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start, start + unformattedText.length);
      }, 0);
    } else {
      // Add bold formatting
      const formattedText = `**${selectedText}**`;
      
      const newMarkdown = markdown.substring(0, start) + formattedText + markdown.substring(end);
      setMarkdown(newMarkdown);
      
      // Focus back to textarea and adjust selection
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start, start + formattedText.length);
      }, 0);
    }
  };

  // Function to toggle italic formatting
  const toggleItalic = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);

    if (!selectedText) {
      // If no text is selected, insert italic markers
      insertTextAtCursor('*', '*');
      return;
    }

    // Check if text is already italic
    if (isTextItalic(selectedText)) {
      // Remove italic formatting
      const unformattedText = removeItalicFormatting(selectedText);
      
      const newMarkdown = markdown.substring(0, start) + unformattedText + markdown.substring(end);
      setMarkdown(newMarkdown);
      
      // Focus back to textarea and adjust selection
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start, start + unformattedText.length);
      }, 0);
    } else {
      // Add italic formatting
      const formattedText = `*${selectedText}*`;
      
      const newMarkdown = markdown.substring(0, start) + formattedText + markdown.substring(end);
      setMarkdown(newMarkdown);
      
      // Focus back to textarea and adjust selection
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start, start + formattedText.length);
      }, 0);
    }
  };

  // Function to toggle code formatting
  const toggleCode = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);

    if (!selectedText) {
      // If no text is selected, insert code markers
      insertTextAtCursor('`', '`');
      return;
    }

    // Check if text is already code
    if (isTextCode(selectedText)) {
      // Remove code formatting
      const unformattedText = removeCodeFormatting(selectedText);
      
      const newMarkdown = markdown.substring(0, start) + unformattedText + markdown.substring(end);
      setMarkdown(newMarkdown);
      
      // Focus back to textarea and adjust selection
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start, start + unformattedText.length);
      }, 0);
    } else {
      // Add code formatting
      const formattedText = `\`${selectedText}\``;
      
      const newMarkdown = markdown.substring(0, start) + formattedText + markdown.substring(end);
      setMarkdown(newMarkdown);
      
      // Focus back to textarea and adjust selection
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start, start + formattedText.length);
      }, 0);
    }
  };

  // Handle tab key press for indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      // If there's selected text, indent each line
      if (start !== end) {
        const selectedText = markdown.substring(start, end);
        const lines = selectedText.split('\n');
        const indentedLines = lines.map(line => `  ${line}`); // Add 2 spaces for indentation
        const indentedText = indentedLines.join('\n');
        
        const newMarkdown = markdown.substring(0, start) + indentedText + markdown.substring(end);
        setMarkdown(newMarkdown);
        
        // Maintain selection after indentation
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start, start + indentedText.length);
        }, 0);
      } else {
        // If no text is selected, just insert two spaces
        const newMarkdown = markdown.substring(0, start) + '  ' + markdown.substring(end);
        setMarkdown(newMarkdown);
        
        // Move cursor after the inserted spaces
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + 2, start + 2);
        }, 0);
      }
    }
  };

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    insertTextAtCursor,
    convertToBulletList,
    convertToNumberedList,
    toggleHeading,
    toggleBold,
    toggleItalic,
    toggleCode
  }));

  return (
    <div className={`flex flex-col md:flex-row ${isFullscreen ? 'h-[calc(100vh-130px)]' : 'h-[calc(100vh-200px)]'} transition-all duration-300`}>
      {/* Editor */}
      {(!isFullscreen || fullscreenMode === 'editor') && (
        <div className={`${isFullscreen ? 'w-full p-4 md:p-6' : 'w-full md:w-1/2 p-4 md:p-6'} transition-all duration-300`}>
          <div className="h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
            <div className="bg-gray-800/80 backdrop-blur-sm px-4 py-2 border-b border-gray-700">
              <h2 className="text-sm font-medium text-gray-300">Editor</h2>
            </div>
            <textarea
              ref={textareaRef}
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full h-[calc(100%-40px)] p-4 font-mono text-sm resize-none focus:ring-0 focus:outline-none bg-transparent text-gray-100 custom-scrollbar"
              placeholder="Start writing your markdown here..."
            />
          </div>
        </div>
      )}

      {/* Preview */}
      {(!isFullscreen || fullscreenMode === 'preview') && (
        <div className={`${isFullscreen ? 'w-full p-4 md:p-6' : 'w-full md:w-1/2 p-4 md:p-6 border-t md:border-t-0 md:border-l border-gray-700'} transition-all duration-300 mt-4 md:mt-0`}>
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