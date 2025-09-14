import { useEffect, useState } from 'react';
import { EditorProvider } from './components/EditorProvider';
import { EditorLayout } from './components/layout';
import { MobileWarningModal } from './components/modals';
import './index.css';

function App() {
  const [showMobileWarning, setShowMobileWarning] = useState(false);

  // Check if user is on a mobile device
  useEffect(() => {
    const checkMobile = () => {
      // More comprehensive mobile detection
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mobi/i.test(navigator.userAgent) || 
                       window.innerWidth <= 768;
      
      // Check if user has already acknowledged the mobile warning
      const hasAcknowledged = localStorage.getItem('mobileWarningAcknowledged') === 'true';
      
      console.log('User Agent:', navigator.userAgent);
      console.log('Window Width:', window.innerWidth);
      console.log('Is mobile:', isMobile);
      console.log('Has acknowledged:', hasAcknowledged);
      
      if (isMobile && !hasAcknowledged) {
        console.log('Showing mobile warning modal');
        setShowMobileWarning(true);
      } else {
        console.log('Not showing mobile warning modal');
      }
    };

    // Check on initial load
    checkMobile();

    // Add resize listener to detect screen size changes
    window.addEventListener('resize', checkMobile);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
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