import React from 'react';
import MermaidRenderer from './MermaidRenderer';

interface MarkdownPreviewProps {
  markdown: string;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ markdown }) => {
  const renderMarkdown = (text: string) => {
    // Find all mermaid diagrams in the text
    const mermaidRegex = /```mermaid\n([\s\S]*?)\n```/g;
    const mermaidMatches = [...text.matchAll(mermaidRegex)];
    
    // If no mermaid diagrams, process entire text as regular markdown
    if (mermaidMatches.length === 0) {
      return <div dangerouslySetInnerHTML={{ __html: renderRegularMarkdown(text) }} />;
    }
    
    // Split text by mermaid diagrams while preserving content
    const parts = [];
    let lastIndex = 0;
    let mermaidIndex = 0;
    
    for (const match of mermaidMatches) {
      const [fullMatch, chartContent] = match;
      const matchIndex = match.index!;
      
      // Add text before the mermaid diagram
      if (matchIndex > lastIndex) {
        const beforeText = text.substring(lastIndex, matchIndex);
        parts.push({
          type: 'markdown',
          content: beforeText,
          key: `markdown-${parts.length}`
        });
      }
      
      // Add the mermaid diagram
      parts.push({
        type: 'mermaid',
        content: chartContent.trim(),
        key: `mermaid-${mermaidIndex++}`
      });
      
      lastIndex = matchIndex + fullMatch.length;
    }
    
    // Add remaining text after the last mermaid diagram
    if (lastIndex < text.length) {
      const afterText = text.substring(lastIndex);
      parts.push({
        type: 'markdown',
        content: afterText,
        key: `markdown-${parts.length}`
      });
    }
    
    // Render all parts
    return parts.map((part) => {
      if (part.type === 'mermaid') {
        return (
          <MermaidRenderer 
            key={part.key}
            chart={part.content}
            id={part.key}
          />
        );
      } else {
        return (
          <div 
            key={part.key}
            dangerouslySetInnerHTML={{ __html: renderRegularMarkdown(part.content) }}
          />
        );
      }
    });
  };
  
  const renderRegularMarkdown = (text: string) => {
    let html = text;
    
    // Handle images first to prevent interference from other replacements
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-xl border border-gray-700 my-6 shadow-lg hover:shadow-xl transition-shadow duration-300" />')
    
    // Handle all code blocks
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/gim, (_match, lang, code) => {
      const langLabel = lang ? `<div class="text-xs font-medium text-gray-200 bg-gradient-to-r from-gray-700 to-gray-800 px-3 py-2 rounded-t-lg">${lang}</div>` : '';
      return `<div class="my-6">
        ${langLabel}
        <pre class="bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100 p-5 rounded-b-lg${lang ? '' : '-b'} overflow-x-auto shadow-lg border border-gray-700"><code class="text-sm font-mono">${code.trim()}</code></pre>
      </div>`;
    });

    // Handle tables
    html = html.replace(/(\|.*\|\n)(\|.*\|\n)((?:\|.*\|\n?)*)/gim, (_match, header, _separator, rows) => {
      const headerCells = header.split('|').slice(1, -1).map((cell: string) => 
        `<th class="px-4 py-3 bg-gradient-to-b from-gray-700 to-gray-800 font-semibold text-left border-b border-gray-600 text-gray-100">${cell.trim()}</th>`
      ).join('');
      
      const rowCells = rows.split('\n').filter((row: string) => row.trim()).map((row: string) => {
        const cells = row.split('|').slice(1, -1).map((cell: string) => 
          `<td class="px-4 py-3 border-b border-gray-700 text-gray-200">${cell.trim()}</td>`
        ).join('');
        return `<tr>${cells}</tr>`;
      }).join('');
      
      return `<table class="w-full border-collapse border border-gray-700 my-6 rounded-xl overflow-hidden shadow-lg">
        <thead><tr>${headerCells}</tr></thead>
        <tbody>${rowCells}</tbody>
      </table>`;
    });

    // Process other markdown elements
    html = html
      // Headers
      .replace(/^###### (.*$)/gim, '<h6 class="text-base font-semibold text-gray-100 mt-6 mb-3 tracking-wide">$1</h6>')
      .replace(/^##### (.*$)/gim, '<h5 class="text-lg font-semibold text-gray-100 mt-6 mb-3 tracking-wide">$1</h5>')
      .replace(/^#### (.*$)/gim, '<h4 class="text-xl font-semibold text-gray-100 mt-7 mb-4 tracking-wide">$1</h4>')
      .replace(/^### (.*$)/gim, '<h3 class="text-2xl font-semibold text-gray-100 mt-8 mb-5 tracking-wide">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold text-gray-100 mt-10 mb-7 pb-3 border-b border-gray-700 tracking-wide">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold text-gray-100 mt-12 mb-9 pb-4 border-b-2 border-gray-700 tracking-wide">$1</h1>')
      
      // Text formatting
      .replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em class="text-gray-100">$1</em></strong>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold text-gray-100">$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em class="italic text-gray-200">$1</em>')
      .replace(/~~(.*?)~~/gim, '<del class="line-through text-gray-300">$1</del>')
      .replace(/`([^`]+)`/gim, '<code class="bg-gradient-to-r from-gray-700 to-gray-800 text-red-300 px-2 py-1 rounded-md text-sm font-mono shadow-sm">$1</code>')
      
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" class="text-blue-400 hover:text-blue-300 underline transition-colors duration-200">$1</a>')
      
      // Horizontal rule
      .replace(/^---$/gim, '<hr class="my-10 border-t border-gray-700" />')
      .replace(/^\*\*\*$/gim, '<hr class="my-10 border-t border-gray-700" />')
      
      // Blockquotes
      .replace(/^> (.*)$/gim, '<blockquote class="border-l-4 border-blue-500 pl-6 py-4 my-6 bg-gradient-to-r from-gray-800/50 to-gray-900/50 italic text-gray-200 rounded-r-lg shadow-md">$1</blockquote>')
      
      // Lists - Improved handling for better responsiveness
      .replace(/^\s*\* (.*)$/gim, '<li class="ml-6 mb-2 list-disc text-gray-200">$1</li>')
      .replace(/^\s*- (.*)$/gim, '<li class="ml-6 mb-2 list-disc text-gray-200">$1</li>')
      .replace(/^\s*\+ (.*)$/gim, '<li class="ml-6 mb-2 list-disc text-gray-200">$1</li>')
      .replace(/^\s*(\d+)\. (.*)$/gim, '<li class="ml-6 mb-2 list-decimal text-gray-200">$2</li>');

    // Wrap list items in proper ul/ol tags
    html = html.replace(/(<li class="ml-6 mb-2 list-disc[^>]*>.*?<\/li>\s*)+/gim, '<ul class="my-4 space-y-2">$&</ul>');
    html = html.replace(/(<li class="ml-6 mb-2 list-decimal[^>]*>.*?<\/li>\s*)+/gim, '<ol class="my-4 space-y-2 list-decimal">$&</ol>');

    // Convert paragraphs - split by double newlines and wrap non-HTML content in paragraphs
    const blocks = html.split(/\n\s*\n/);
    html = blocks.map(block => {
      // If block is empty, skip
      if (block.trim() === '') {
        return '';
      }
      
      // If block already contains block-level HTML tags, don't wrap in paragraph
      if (/<(h[1-6]|ul|ol|li|div|pre|blockquote|table|hr)/.test(block)) {
        return block;
      }
      
      // Wrap in paragraph
      return `<p class="text-gray-200 mb-5 leading-relaxed">${block}</p>`;
    }).filter(block => block !== '').join('\n');

    // Handle line breaks within paragraphs
    html = html.replace(/([^>])\n([^<])/g, '$1<br>$2');

    return html;
  };

  return (
    <div className="prose prose-lg max-w-none w-full" style={{ lineHeight: '1.7', color: '#E5E7EB' }}>
      {renderMarkdown(markdown)}
    </div>
  );
};

export default MarkdownPreview;