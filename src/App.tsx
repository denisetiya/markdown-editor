import { useEffect, useState } from 'react';
import { EditorProvider } from './components/EditorProvider';
import { EditorLayout } from './components/layout';
import { MobileWarningModal } from './components/modals';
import './index.css';

function App() {
  const [showMobileWarning, setShowMobileWarning] = useState(false);

  // Check if user is on a mobile device
  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Check if user has already acknowledged the mobile warning
    const hasAcknowledged = localStorage.getItem('mobileWarningAcknowledged') === 'true';
    
    if (isMobile && !hasAcknowledged) {
      setShowMobileWarning(true);
    }
  }, []);

  const handleMobileWarningClose = () => {
    // Save that the user has acknowledged the warning
    localStorage.setItem('mobileWarningAcknowledged', 'true');
    setShowMobileWarning(false);
  };

  return (
    <div className="dark">
      <EditorProvider>
        <EditorLayout />
      </EditorProvider>
      
      {/* Mobile Warning Modal */}
      <MobileWarningModal 
        isOpen={showMobileWarning} 
        onClose={handleMobileWarningClose} 
      />
    </div>
  );
}

export default App;