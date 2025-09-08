import React, { useState, useEffect } from 'react';
import { X, Copy, Check } from 'lucide-react';

interface TableOfContentsModalProps {
  onClose: () => void;
  onInsert: (tocMarkdown: string) => void;
  markdown: string;
}

interface Heading {
  level: number;
  text: string;
  id: string;
}

const TableOfContentsModal: React.FC<TableOfContentsModalProps> = ({ onClose, onInsert, markdown }) => {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [copied, setCopied] = useState(false);
  const [alignCenter, setAlignCenter] = useState(true);

  // Extract headings from markdown
  useEffect(() => {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const foundHeadings: Heading[] = [];
    let match;
    
    while ((match = headingRegex.exec(markdown)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      
      foundHeadings.push({
        level,
        text,
        id
      });
    }
    
    setHeadings(foundHeadings);
  }, [markdown]);

  const generateTOC = () => {
    if (headings.length === 0) {
      return '';
    }

    let toc = '';
    
    if (alignCenter) {
      toc += '<div align="center">\n\n';
    }
    
    toc += '**Table of Contents**\n\n';
    
    headings.forEach(heading => {
      const indent = '  '.repeat(heading.level - 1);
      toc += `${indent}- [${heading.text}](#${heading.id})\n`;
    });
    
    if (alignCenter) {
      toc += '\n</div>';
    }
    
    return toc;
  };

  const generatePreviewHtml = () => {
    if (headings.length === 0) {
      return '<p class="text-gray-500">// No headings found</p>';
    }

    let tocHtml = '';
    
    if (alignCenter) {
      tocHtml += '<div align="center">';
    }
    
    tocHtml += '<p><strong>Table of Contents</strong></p><ul>';
    
    headings.forEach(heading => {
      const indent = '&nbsp;'.repeat((heading.level - 1) * 2);
      tocHtml += `<li>${indent}<a href="#${heading.id}">${heading.text}</a></li>`;
    });
    
    tocHtml += '</ul>';
    
    if (alignCenter) {
      tocHtml += '</div>';
    }
    
    return tocHtml;
  };

  const handleInsert = () => {
    const toc = generateTOC();
    onInsert(toc);
  };

  const handleCopy = () => {
    const toc = generateTOC();
    navigator.clipboard.writeText(toc);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-transparent flex items-center justify-center z-50">
      <div className="bg-gray-900 bg-opacity-90 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4 border border-gray-700 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-100">Table of Contents Generator</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-700 rounded text-gray-300">
            <X size={20} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Configuration */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Options</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={alignCenter}
                    onChange={(e) => setAlignCenter(e.target.checked)}
                    className="rounded bg-gray-800 border-gray-700 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-300">Align center</span>
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Detected Headings</label>
              {headings.length > 0 ? (
                <div className="bg-gray-800 p-3 rounded border border-gray-700 max-h-60 overflow-y-auto">
                  <ul className="space-y-1">
                    {headings.map((heading, index) => (
                      <li key={index} className="text-gray-300">
                        <span className="text-gray-500">{'#'.repeat(heading.level)} </span>
                        {heading.text}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="bg-gray-800 p-3 rounded border border-gray-700 text-gray-500">
                  No headings found in the document
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column - Preview and Actions */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Preview</label>
              <div className="bg-gray-800 p-4 rounded border border-gray-700 min-h-32">
                <div className="text-gray-300 text-sm" dangerouslySetInnerHTML={{ __html: generatePreviewHtml() }} />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Actions</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-1 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm text-gray-300 border border-gray-700"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-700 rounded hover:bg-gray-700 text-sm text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleInsert}
                disabled={headings.length === 0}
                className={`px-4 py-2 rounded text-sm ${
                  headings.length > 0
                    ? 'bg-blue-700 text-gray-100 hover:bg-blue-600'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                Insert TOC
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableOfContentsModal;