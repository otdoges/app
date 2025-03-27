import { useCallback, useState, useRef } from '@lynx-js/react'
import { CircleSearch } from './CircleSearch.jsx'
import { searchApps } from '../services/githubMarketplace.js'
import { initCamera, detectText } from '../services/cameraService.js'
import '../styles/AppSearch.css'

export function AppSearch({ onClose }) {
  const [isSearching, setIsSearching] = useState(false)
  const [isHolding, setIsHolding] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [usingCamera, setUsingCamera] = useState(false)
  const [searchText, setSearchText] = useState('')
  const videoRef = useRef(null)
  const cameraControlsRef = useRef(null)
  
  // Handle search from CircleSearch
  const handleSearch = useCallback(async (query) => {
    try {
      setSearchText(query)
      setLoading(true)
      const results = await searchApps(query)
      setSearchResults(results)
    } catch (error) {
      console.error('Error searching apps:', error)
    } finally {
      setLoading(false)
    }
  }, [])
  
  // Handle search via camera
  const handleCameraSearch = useCallback(async () => {
    try {
      setUsingCamera(true)
      
      // Initialize camera on next render after videoRef is set
      setTimeout(async () => {
        try {
          cameraControlsRef.current = await initCamera(videoRef.current);
        } catch (error) {
          console.error('Camera initialization error:', error);
          setUsingCamera(false);
        }
      }, 100);
      
    } catch (error) {
      console.error('Error starting camera:', error)
      setUsingCamera(false)
    }
  }, [])
  
  // Take photo and detect text
  const handleTakePhoto = useCallback(async () => {
    if (!cameraControlsRef.current) return
    
    try {
      setLoading(true)
      const photo = cameraControlsRef.current.takePhoto()
      const detectedText = await detectText(photo)
      
      // Stop camera and use detected text for search
      stopCamera()
      handleSearch(detectedText)
    } catch (error) {
      console.error('Error processing photo:', error)
      setLoading(false)
    }
  }, [handleSearch])
  
  // Stop camera
  const stopCamera = useCallback(() => {
    if (cameraControlsRef.current) {
      cameraControlsRef.current.stop()
      cameraControlsRef.current = null
    }
    setUsingCamera(false)
  }, [])
  
  // Open app from search results
  const openApp = useCallback((url) => {
    // In a real app, this would integrate with native app launching functionality
    console.log('Opening app URL:', url)
    // Mock implementation - would be replaced with actual native bridge call
    window.open(url, '_blank')
  }, [])
  
  const handleCircleActivate = useCallback(() => {
    setIsHolding(false)
  }, [])
  
  const handleCircleCancel = useCallback(() => {
    setIsHolding(false)
  }, [])
  
  return (
    <view className="app-search-container">
      {!isSearching ? (
        <view 
          className="app-search-trigger" 
          bindtap={() => {
            setIsSearching(true)
            setIsHolding(true)
          }}
        >
          <view className="app-search-icon">
            <text>🔍</text>
          </view>
          <text className="app-search-text">Search</text>
        </view>
      ) : (
        <>
          {isHolding && (
            <CircleSearch 
              onSearch={handleSearch} 
              onClose={() => {
                setIsSearching(false)
                setIsHolding(false)
              }}
              onCancel={handleCircleCancel}
              onActivate={handleCircleActivate}
            />
          )}
          
          {!isHolding && !usingCamera && (
            <view className="app-search-menu">
              <view className="app-search-menu-header">
                <text className="app-search-menu-title">Search</text>
                <view 
                  className="app-search-menu-close" 
                  bindtap={() => setIsSearching(false)}
                >
                  <text>✕</text>
                </view>
              </view>
              
              <view className="app-search-menu-options">
                <view 
                  className="app-search-menu-option"
                  bindtap={() => setIsHolding(true)}
                >
                  <view className="app-search-menu-option-icon">
                    <text>🔍</text>
                  </view>
                  <text className="app-search-menu-option-text">Text Search</text>
                </view>
                
                <view 
                  className="app-search-menu-option"
                  bindtap={handleCameraSearch}
                >
                  <view className="app-search-menu-option-icon">
                    <text>📷</text>
                  </view>
                  <text className="app-search-menu-option-text">Camera Search</text>
                </view>
              </view>
            </view>
          )}
          
          {usingCamera && (
            <view className="app-search-camera">
              <view className="app-search-camera-header">
                <text className="app-search-camera-title">Camera Search</text>
                <view 
                  className="app-search-camera-close" 
                  bindtap={stopCamera}
                >
                  <text>✕</text>
                </view>
              </view>
              
              <video ref={videoRef} className="app-search-camera-video" />
              
              <view className="app-search-camera-controls">
                <view 
                  className="app-search-camera-button"
                  bindtap={handleTakePhoto}
                >
                  <text className="app-search-camera-button-text">Capture</text>
                </view>
              </view>
            </view>
          )}
          
          {loading && (
            <view className="app-search-loading">
              <view className="app-search-loading-spinner"></view>
              <text>Loading...</text>
            </view>
          )}
          
          {!loading && searchResults.length > 0 && !isHolding && !usingCamera && (
            <view className="app-search-results">
              <view className="app-search-results-header">
                <text className="app-search-results-title">
                  Results for "{searchText}"
                </text>
              </view>
              
              <view className="app-search-results-list">
                {searchResults.map(app => (
                  <view 
                    key={app.id} 
                    className="app-search-result-item"
                    bindtap={() => openApp(app.url)}
                  >
                    {app.icon && (
                      <image 
                        className="app-search-result-icon" 
                        src={app.icon}
                      />
                    )}
                    <view className="app-search-result-content">
                      <text className="app-search-result-name">{app.name}</text>
                      <text className="app-search-result-description">{app.description}</text>
                      <view className="app-search-result-category">
                        <text>{app.category}</text>
                      </view>
                    </view>
                  </view>
                ))}
              </view>
            </view>
          )}
        </>
      )}
    </view>
  )
} 