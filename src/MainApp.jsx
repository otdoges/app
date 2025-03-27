import { useState, useCallback } from '@lynx-js/react'
import './styles/MainApp.css'
import { AppSearch } from './components/AppSearch.jsx'
import { Translation } from './components/Translation.jsx'
import { askAI } from './services/aiService.js'

export function MainApp() {
  const [showTranslation, setShowTranslation] = useState(false)
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [aiQuery, setAIQuery] = useState('')
  const [aiResponse, setAIResponse] = useState('')
  const [isAILoading, setIsAILoading] = useState(false)
  const [conversationHistory, setConversationHistory] = useState([])
  
  const handleAIQuerySubmit = useCallback(async () => {
    if (!aiQuery.trim()) return;
    
    try {
      setIsAILoading(true);
      
      // Add user message to history
      const updatedHistory = [
        ...conversationHistory,
        { role: 'user', content: aiQuery }
      ];
      setConversationHistory(updatedHistory);
      
      // Get AI response
      const response = await askAI(aiQuery, conversationHistory);
      
      // Add AI response to history
      setConversationHistory([
        ...updatedHistory,
        { role: 'assistant', content: response }
      ]);
      
      setAIResponse(response);
      setAIQuery('');
    } catch (error) {
      console.error('AI query error:', error);
    } finally {
      setIsAILoading(false);
    }
  }, [aiQuery, conversationHistory]);
  
  return (
    <view className="main-app">
      {/* App Header */}
      <view className="main-header">
        <text className="app-title">CircleSearch</text>
      </view>
      
      {/* Main Content */}
      <view className="main-content">
        <view className="welcome-section">
          <text className="welcome-text">Welcome to CircleSearch</text>
          <text className="description-text">
            Intelligent app search with powerful features
          </text>
        </view>
        
        <view className="features-list">
          <view className="feature-item" bindtap={() => {}}>
            <view className="feature-icon">🔍</view>
            <view className="feature-text">
              <text className="feature-title">Circle Search</text>
              <text className="feature-description">Hold for 3 seconds to activate search</text>
            </view>
          </view>
          
          <view className="feature-item" bindtap={() => setShowTranslation(true)}>
            <view className="feature-icon">🌐</view>
            <view className="feature-text">
              <text className="feature-title">Live Translation</text>
              <text className="feature-description">Translate with voice & text input</text>
            </view>
          </view>
          
          <view className="feature-item" bindtap={() => setShowAIAssistant(true)}>
            <view className="feature-icon">🤖</view>
            <view className="feature-text">
              <text className="feature-title">AI Assistant</text>
              <text className="feature-description">Powered by GPT-4o</text>
            </view>
          </view>
          
          <view className="feature-item">
            <view className="feature-icon">📷</view>
            <view className="feature-text">
              <text className="feature-title">Camera Search</text>
              <text className="feature-description">Search from captured images</text>
            </view>
          </view>
        </view>
      </view>
      
      {/* App Search Component */}
      <AppSearch onClose={() => {}} />
      
      {/* Translation Modal */}
      {showTranslation && (
        <Translation onClose={() => setShowTranslation(false)} />
      )}
      
      {/* AI Assistant Modal */}
      {showAIAssistant && (
        <view className="ai-assistant-container">
          <view className="ai-assistant-backdrop" bindtap={() => setShowAIAssistant(false)} />
          
          <view className="ai-assistant-modal">
            <view className="ai-assistant-header">
              <text className="ai-assistant-title">AI Assistant</text>
              <view 
                className="ai-assistant-close" 
                bindtap={() => setShowAIAssistant(false)}
              >
                <text>✕</text>
              </view>
            </view>
            
            <view className="ai-assistant-content">
              <view className="ai-assistant-conversation">
                {conversationHistory.length === 0 ? (
                  <view className="ai-assistant-empty">
                    <text>Ask me anything! I'm powered by GPT-4o.</text>
                  </view>
                ) : (
                  conversationHistory.map((message, index) => (
                    <view 
                      key={index} 
                      className={`ai-message ${message.role === 'user' ? 'user' : 'assistant'}`}
                    >
                      <text>{message.content}</text>
                    </view>
                  ))
                )}
              </view>
              
              <view className="ai-assistant-input-container">
                <input 
                  type="text" 
                  className="ai-assistant-input"
                  placeholder="Type your message..."
                  value={aiQuery}
                  oninput={(e) => setAIQuery(e.target.value)}
                  onkeypress={(e) => {
                    if (e.key === 'Enter') handleAIQuerySubmit();
                  }}
                />
                
                <view 
                  className="ai-assistant-send"
                  bindtap={handleAIQuerySubmit}
                  disabled={!aiQuery.trim() || isAILoading}
                >
                  {isAILoading ? (
                    <view className="ai-assistant-spinner" />
                  ) : (
                    <text>Send</text>
                  )}
                </view>
              </view>
            </view>
          </view>
        </view>
      )}
    </view>
  )
} 