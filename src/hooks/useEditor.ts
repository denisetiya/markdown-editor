import { useContext } from 'react';
import { EditorContext } from './EditorContext';
import type { EditorContextType } from './types';

// Custom hook
export const useEditor = (): EditorContextType => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};