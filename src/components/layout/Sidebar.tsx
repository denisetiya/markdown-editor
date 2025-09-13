import React, { useState, useEffect } from 'react';
import { X, Settings, Info, Palette, CreditCard, Heart } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const [activeItem, setActiveItem] = useState('settings');
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(() => {
    // Initialize from localStorage or default to true
    const savedAutoSaveState = localStorage.getItem('autoSaveEnabled');
    return savedAutoSaveState !== null ? JSON.parse(savedAutoSaveState) : true;
  });

  // Save auto-save setting to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('autoSaveEnabled', JSON.stringify(autoSaveEnabled));
  }, [autoSaveEnabled]);

  const menuItems = [
    { id: 'pricing', label: 'Pricing', icon: CreditCard },
    { id: 'themes', label: 'Themes', icon: Palette },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'support', label: 'Support', icon: Heart },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <>
      {/* Sidebar Backdrop (for mobile) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed left-0 top-0 h-full bg-gradient-to-b from-gray-900 to-gray-800 z-30 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          w-64 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center">
              {/* <FileText className="mr-2" size={24} /> */}
              <img src="/logo.png" alt="Logo" className="h-16 w-16 rounded-md" />
              <span>Md Editor</span>
            </h2>
            <button
              onClick={toggleSidebar}
              className="p-1 rounded hover:bg-gray-800 text-gray-400 md:hidden"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav>
            <ul className="space-y-1 px-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveItem(item.id)}
                      className={`w-full flex items-center px-4 py-3 text-sm rounded-lg transition-all duration-200 ${
                        activeItem === item.id
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <Icon size={18} className="mr-3" />
                      <span>{item.label}</span>
                      {item.id === 'themes' && (
                        <span className="ml-auto text-xs bg-yellow-500 text-yellow-900 px-2 py-0.5 rounded">Coming Soon</span>
                      )}
                      {item.id === 'pricing' && (
                        <span className="ml-auto text-xs bg-blue-500 text-blue-900 px-2 py-0.5 rounded">AI</span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Content Sections */}
          <div className="px-4 py-6 mt-4 border-t border-gray-800">
            {activeItem === 'pricing' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Pricing</h3>
                <p className="text-gray-400 text-sm">
                  Coming Soon with AI Integration
                </p>
                <div className="p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700">
                  <h4 className="font-medium text-gray-200 mb-2">AI-Powered Features</h4>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>AI Document Generation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>Smart Content Suggestions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>Automated Formatting</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>Advanced Analytics</span>
                    </li>
                  </ul>
                  <div className="mt-4 p-3 bg-gray-900 rounded-lg">
                    <p className="text-center text-gray-300 text-sm">
                      Stay tuned for our premium AI-enhanced features!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeItem === 'themes' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Themes</h3>
                <p className="text-gray-400 text-sm">
                  Customize the editor appearance.
                </p>
                <div className="p-4 bg-gray-800 rounded-lg text-center">
                  <p className="text-gray-400">Coming Soon</p>
                </div>
              </div>
            )}

            {activeItem === 'settings' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Settings</h3>
                <p className="text-gray-400 text-sm">
                  Configure editor preferences.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Auto Save</span>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input 
                        type="checkbox" 
                        id="toggle" 
                        className="sr-only" 
                        checked={autoSaveEnabled}
                        onChange={() => setAutoSaveEnabled(!autoSaveEnabled)}
                      />
                      <label
                        htmlFor="toggle"
                        className={`block h-6 w-10 rounded-full cursor-pointer ${
                          autoSaveEnabled ? 'bg-blue-600' : 'bg-gray-700'
                        }`}
                      >
                        <div className={`dot absolute top-1 bg-white w-4 h-4 rounded-full transition transform ${
                          autoSaveEnabled ? 'translate-x-5' : 'translate-x-1'
                        }`}></div>
                      </label>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    <p>Auto-save is {autoSaveEnabled ? 'enabled' : 'disabled'}</p>
                    <p className="mt-1">Content is automatically saved to your browser's local storage.</p>
                  </div>
                </div>
              </div>
            )}

            {activeItem === 'support' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Support Us</h3>
                <p className="text-gray-400 text-sm">
                  Help us keep improving this editor by supporting our development.
                </p>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700">
                    <h4 className="font-medium text-gray-200 mb-2 flex items-center">
                      <Heart className="mr-2 text-red-500" size={18} />
                      Saweria
                    </h4>
                    <p className="text-gray-400 text-sm mb-3">
                      Support us through Saweria, Indonesia's leading donation platform.
                    </p>
                    <a 
                      href="https://saweria.co/denisetiya1" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block w-full text-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      Donate via Saweria
                    </a>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700">
                    <h4 className="font-medium text-gray-200 mb-2">Other Ways to Support</h4>
                    <ul className="text-gray-400 text-sm space-y-2">
                      <li className="flex items-start">
                        <span className="text-green-400 mr-2">•</span>
                        <span>Star us on GitHub</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-400 mr-2">•</span>
                        <span>Share with your friends</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-400 mr-2">•</span>
                        <span>Report bugs or suggest features</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeItem === 'about' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">About</h3>
                <p className="text-gray-400 text-sm">
                  Information about this markdown editor.
                </p>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h4 className="font-medium text-gray-200">Markdown Editor</h4>
                    <p className="text-gray-400 text-sm mt-2">
                      A powerful and intuitive markdown editor built with React, TypeScript, and Tailwind CSS.
                    </p>
                  </div>
                  <div className="text-gray-400 text-sm">
                    <p>Version: 1.0.0</p>
                    <p className="mt-1">© {new Date().getFullYear()} Deni Setiya. All rights reserved.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-800 text-center">
          <p className="text-xs text-gray-500">
            Markdown Editor v1.0
          </p>
        </div>
      </div>
    </>
  );
};
