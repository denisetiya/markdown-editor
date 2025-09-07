// Define types
export type ViewMode = 'editor' | 'preview' | 'split';
export type Theme = 'light' | 'dark';

export interface EditorState {
  content: string;
  currentFile: string | null;
  viewMode: ViewMode;
  theme: Theme;
  isModified: boolean;
  cursorPosition: number;
  scrollSync: boolean;
}

export type EditorAction = 
  | { type: 'SET_CONTENT'; payload: string }
  | { type: 'SET_FILE'; payload: string | null }
  | { type: 'SET_VIEW_MODE'; payload: ViewMode }
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_MODIFIED'; payload: boolean }
  | { type: 'SET_CURSOR_POSITION'; payload: number }
  | { type: 'TOGGLE_SCROLL_SYNC' };

// Context type
export interface EditorContextType {
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
}