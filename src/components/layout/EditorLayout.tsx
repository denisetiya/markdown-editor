import React, { useState, useEffect } from 'react';
import { useEditor } from '../../hooks';
import { Header } from './Header';
import { Footer } from './Footer';
import MarkdownEditor from '../../pages/MarkdownEditor';
import { StatusBar } from './StatusBar';
import { Sidebar } from './Sidebar';

export const EditorLayout: React.FC = () => {
  const { state } = useEditor();
  const { theme } = state;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(true);

  // Load sidebar state and auto-save setting from localStorage on component mount
  useEffect(() => {
    const savedSidebarState = localStorage.getItem('sidebarOpen');
    if (savedSidebarState !== null) {
      setIsSidebarOpen(JSON.parse(savedSidebarState));
    }
    
    // Load auto-save setting from localStorage
    const savedAutoSaveState = localStorage.getItem('autoSaveEnabled');
    if (savedAutoSaveState !== null) {
      setIsAutoSaveEnabled(JSON.parse(savedAutoSaveState));
    }
  }, []);

  // Save sidebar state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`h-screen flex flex-col ${theme === 'dark' ? 'dark' : ''} bg-gradient-to-br from-gray-900 to-gray-950`}>
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : ''}`}>
          <div className="flex-1 overflow-hidden">
            <MarkdownEditor isAutoSaveEnabled={isAutoSaveEnabled} />
          </div>
          <StatusBar />
        </div>
      </div>
      <Footer />
    </div>
  );
};