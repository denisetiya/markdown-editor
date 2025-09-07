import React, { useReducer, type ReactNode } from 'react';
import { EditorContext, editorReducer, initialEditorState } from '../hooks/EditorContext';

// Provider component
export const EditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(editorReducer, initialEditorState);

  return (
    <EditorContext.Provider value={{ state, dispatch }}>
      {children}
    </EditorContext.Provider>
  );
};