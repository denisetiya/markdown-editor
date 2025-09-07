import { createContext } from 'react';
import type { EditorState, EditorAction, EditorContextType } from './types';

// Create context
export const EditorContext = createContext<EditorContextType | undefined>(undefined);

// Reducer
export const editorReducer = (state: EditorState, action: EditorAction): EditorState => {
  switch (action.type) {
    case 'SET_CONTENT':
      return { ...state, content: action.payload, isModified: true };
    case 'SET_FILE':
      return { ...state, currentFile: action.payload, isModified: false };
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_MODIFIED':
      return { ...state, isModified: action.payload };
    case 'SET_CURSOR_POSITION':
      return { ...state, cursorPosition: action.payload };
    case 'TOGGLE_SCROLL_SYNC':
      return { ...state, scrollSync: !state.scrollSync };
    default:
      return state;
  }
};

// Export initial state
export const initialEditorState: EditorState = {
  content: '# Welcome to Markdown Editor\n\nStart typing here...',
  currentFile: null,
  viewMode: 'split',
  theme: 'dark',
  isModified: false,
  cursorPosition: 0,
  scrollSync: true,
};