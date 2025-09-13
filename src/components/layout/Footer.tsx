import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 border-t border-gray-700 px-6 py-4 text-sm text-gray-300 flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0 shadow-lg">
      <div className="flex items-center space-x-2">
        <img src="/logo.png" alt="Markdown Editor Logo" className="h-6 w-6 rounded-md" />
        <span>© {new Date().getFullYear()} Deni Setiya. All rights reserved.</span>
      </div>
      <div>
        <a 
          href="https://github.com/denisetiya/markdown-editor" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 transition-colors flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
          GitHub: denisetiya
        </a>
      </div>
      
      {/* Additional SEO content */}
      <div className="hidden">
        <h2>Markdown Editor - Online Markdown to HTML Converter</h2>
        <p>
          Free online markdown editor with live preview. Convert markdown to HTML, create documentation, 
          write README files, and format text with our easy-to-use markdown editor. Features include 
          syntax highlighting, real-time preview, export to PDF, and GitHub markdown support.
        </p>
        <p>
          Keywords: markdown editor, online markdown editor, markdown to html, github markdown, 
          markdown preview, text editor, documentation tool, readme editor, markdown converter
        </p>
      </div>
    </footer>
  );
};