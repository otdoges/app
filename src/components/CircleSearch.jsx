import { useCallback, useState, useEffect, useRef } from '@lynx-js/react'
import '../styles/CircleSearch.css'

export function CircleSearch({ onSearch, onClose, onCancel, onActivate }) {
  const [query, setQuery] = useState('')
  const [isHolding, setIsHolding] = useState(false)
  const [holdProgress, setHoldProgress] = useState(0)
  const [isActivated, setIsActivated] = useState(false)
  const holdTimerRef = useRef(null)
  const progressInterval = useRef(null)
  const HOLD_TIME = 3000 // 3 seconds hold time
  
  // Clean up timers when component unmounts
  useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current)
      if (progressInterval.current) clearInterval(progressInterval.current)
    }
  }, [])
  
  const startHold = useCallback(() => {
    setIsHolding(true)
    setHoldProgress(0)
    
    // Update progress every 30ms for smooth animation
    progressInterval.current = setInterval(() => {
      setHoldProgress(prev => {
        const newProgress = prev + (30 / HOLD_TIME) * 100
        return newProgress >= 100 ? 100 : newProgress
      })
    }, 30)
    
    // Set timer for hold completion
    holdTimerRef.current = setTimeout(() => {
      clearInterval(progressInterval.current)
      setHoldProgress(100)
      setIsActivated(true)
      
      // Notify parent component of activation
      if (onActivate) onActivate()
      
    }, HOLD_TIME)
  }, [onActivate])
  
  const stopHold = useCallback(() => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current)
      holdTimerRef.current = null
    }
    
    if (progressInterval.current) {
      clearInterval(progressInterval.current)
      progressInterval.current = null
    }
    
    setIsHolding(false)
    setHoldProgress(0)
    
    // If not activated, notify parent of cancellation
    if (!isActivated && onCancel) {
      onCancel()
    }
  }, [isActivated, onCancel])
  
  const handleSearch = useCallback(() => {
    if (query.trim()) {
      onSearch(query)
    }
  }, [query, onSearch])
  
  return (
    <view className="circle-search-container">
      <view 
        className="circle-search-backdrop" 
        bindtap={isActivated ? onClose : null} 
        bindtouchstart={!isActivated ? startHold : null}
        bindtouchend={!isActivated ? stopHold : null}
        bindtouchmove={!isActivated ? stopHold : null}
      />
      
      {/* Progress Ring */}
      <view className={`circle-search-progress ${isHolding ? 'active' : ''}`}>
        <view 
          className="circle-search-progress-fill" 
          style={{ transform: `scale(${holdProgress / 100})` }}
        />
      </view>
      
      {/* Search Interface (shown after activation) */}
      {isActivated && (
        <view className="circle-search">
          <view className="circle-search-header">
            <text>Circle Search</text>
          </view>
          
          <input 
            type="text" 
            className="circle-search-input" 
            value={query} 
            oninput={(e) => setQuery(e.target.value)}
            placeholder="Search for apps..."
            autofocus="true"
          />
          
          <view className="circle-search-button-container">
            <view className="circle-search-button cancel" bindtap={onClose}>
              <text className="circle-search-button-text">Cancel</text>
            </view>
            
            <view className="circle-search-button search" bindtap={handleSearch}>
              <text className="circle-search-button-text">Search</text>
            </view>
          </view>
        </view>
      )}
    </view>
  )
} 