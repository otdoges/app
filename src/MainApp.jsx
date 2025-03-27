import { useState } from '@lynx-js/react'
import './styles/MainApp.css'
import { AppSearch } from './components/AppSearch.jsx'
import { Translation } from './components/Translation.jsx'

export function MainApp() {
  const [showTranslation, setShowTranslation] = useState(false)
  
  return (
    <view className="main-app">
      <view className="main-header">
        <text className="app-title">CircleSearch</text>
      </view>
      
      <view className="main-content">
        <text className="welcome-text">Welcome to CircleSearch</text>
        <text className="description-text">
          This app adds circle search functionality to your Android apps.
          Use the button in the bottom right to search for apps.
        </text>
        
        <view className="features-list">
          <view className="feature-item">
            <view className="feature-icon">🔍</view>
            <view className="feature-text">
              <text className="feature-title">App Search</text>
              <text className="feature-description">Search for apps using a circle interface</text>
            </view>
          </view>
          
          <view className="feature-item" bindtap={() => setShowTranslation(true)}>
            <view className="feature-icon">🌐</view>
            <view className="feature-text">
              <text className="feature-title">Live Translation</text>
              <text className="feature-description">Translate text on the fly</text>
            </view>
          </view>
          
          <view className="feature-item">
            <view className="feature-icon">⚡</view>
            <view className="feature-text">
              <text className="feature-title">Fast Access</text>
              <text className="feature-description">Quick access to your favorite apps</text>
            </view>
          </view>
        </view>
      </view>
      
      {/* App Search Circle Button */}
      <AppSearch onClose={() => {}} />
      
      {/* Translation Modal */}
      {showTranslation && (
        <Translation onClose={() => setShowTranslation(false)} />
      )}
    </view>
  )
} 