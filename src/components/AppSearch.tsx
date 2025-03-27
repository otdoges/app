import { useCallback, useState } from '@lynx-js/react'
import { CircleSearch } from './CircleSearch'
import { searchApps } from '../services/githubMarketplace'
import '../styles/AppSearch.css'

interface AppSearchProps {
  onClose: () => void
}

export function AppSearch({ onClose }: AppSearchProps) {
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  
  const handleSearch = useCallback(async (query: string) => {
    try {
      setLoading(true)
      const results = await searchApps(query)
      setSearchResults(results)
    } catch (error) {
      console.error('Error searching apps:', error)
    } finally {
      setLoading(false)
    }
  }, [])
  
  const openApp = useCallback((url: string) => {
    // In a real app, this would integrate with native app launching functionality
    console.log('Opening app URL:', url)
    // Mock implementation - would be replaced with actual native bridge call
    window.open(url, '_blank')
  }, [])
  
  return (
    <view className="app-search-container">
      {!isSearching ? (
        <view className="app-search-trigger" bindtap={() => setIsSearching(true)}>
          <view className="app-search-icon">
            <text>🔍</text>
          </view>
          <text className="app-search-text">App Search</text>
        </view>
      ) : (
        <>
          <CircleSearch onSearch={handleSearch} onClose={() => setIsSearching(false)} />
          
          {loading && (
            <view className="app-search-loading">
              <text>Loading...</text>
            </view>
          )}
          
          {!loading && searchResults.length > 0 && (
            <view className="app-search-results">
              <view className="app-search-results-header">
                <text className="app-search-results-title">Search Results</text>
                <view className="app-search-results-close" bindtap={onClose}>
                  <text>✕</text>
                </view>
              </view>
              
              <view className="app-search-results-list">
                {searchResults.map(app => (
                  <view 
                    key={app.id} 
                    className="app-search-result-item"
                    bindtap={() => openApp(app.url)}
                  >
                    <text className="app-search-result-name">{app.name}</text>
                    <text className="app-search-result-description">{app.description}</text>
                    <view className="app-search-result-category">
                      <text>{app.category}</text>
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