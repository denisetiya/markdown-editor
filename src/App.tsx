import { EditorProvider } from './components/EditorProvider';
import { EditorLayout } from './components/EditorLayout';
import './index.css';

function App() {
  return (
    <div className="dark">
      <EditorProvider>
        <EditorLayout />
      </EditorProvider>
    </div>
  );
}

export default App;