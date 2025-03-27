import { useState } from '@lynx-js/react';
import '../styles/MainApp.css';

// Import existing components - commented out references to missing components
// import { CircleSearch } from './CircleSearch.jsx';
// import { AIAssistant } from './AIAssistant.jsx';
import { CameraSearch } from './CameraSearch.jsx';

export function MainApp() {
  // State for modal components
  const [isTranslationOpen, setIsTranslationOpen] = useState(false);
  const [isCameraSearchOpen, setIsCameraSearchOpen] = useState(false);
  
  // Circle Search related state
  const [isCircleSearchActive, setIsCircleSearchActive] = useState(false);
  const [touchStartTime, setTouchStartTime] = useState(0);
  const [touchTimer, setTouchTimer] = useState<number | null>(null);
  
  // Handle touch events for Circle Search
  const handleTouchStart = () => {
    const timer = setTimeout(() => {
      setIsCircleSearchActive(true);
    }, 3000) as unknown as number;
    
    setTouchStartTime(Date.now());
    setTouchTimer(timer);
  };

  const handleTouchEnd = () => {
    if (touchTimer) {
      clearTimeout(touchTimer);
      setTouchTimer(null);
    }
  };

  return (
    <view className="main-app">
      <view className="main-header">
        <text className="welcome-text">Circle Search</text>
      </view>
      
      <view className="features-container">
        {/* Translation feature */}
        <view className="feature-item" bindtap={() => setIsTranslationOpen(true)}>
          <view className="feature-icon">🌍</view>
          <view className="feature-text">
            <text className="feature-title">Translation</text>
            <text className="feature-description">Translate text between languages</text>
          </view>
        </view>
        
        {/* Camera Search feature */}
        <view className="feature-item" bindtap={() => setIsCameraSearchOpen(true)}>
          <view className="feature-icon">📷</view>
          <view className="feature-text">
            <text className="feature-title">Camera Search</text>
            <text className="feature-description">Search using your camera</text>
          </view>
        </view>
      </view>
      
      {/* Circle Search trigger */}
      <view className="circle-search-container">
        <view 
          className="circle-search-trigger" 
          bindtouchstart={handleTouchStart} 
          bindtouchend={handleTouchEnd}
        >
          <text className="circle-search-icon">◯</text>
        </view>
      </view>
      
      {/* Components - Some components might be commented out if they're not yet implemented */}
      {/* CircleSearch component would be here */}
      
      {/* AIAssistant component would be here */}
      
      {/* Translation component would be here */}
      
      {/* Camera Search component */}
      {isCameraSearchOpen && (
        <CameraSearch
          isOpen={isCameraSearchOpen}
          onClose={() => setIsCameraSearchOpen(false)}
        />
      )}
    </view>
  );
} 