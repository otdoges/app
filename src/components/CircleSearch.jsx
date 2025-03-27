import { useCallback, useState } from '@lynx-js/react'
import '../styles/CircleSearch.css'

export function CircleSearch({ onSearch, onClose }) {
  const [query, setQuery] = useState('')
  
  const handleSearch = useCallback(() => {
    if (query.trim()) {
      onSearch(query)
    }
  }, [query, onSearch])
  
  return (
    <view className="circle-search-container">
      <view className="circle-search-backdrop" bindtap={onClose} />
      <view className="circle-search">
        <input 
          type="text" 
          className="circle-search-input" 
          value={query} 
          oninput={(e) => setQuery(e.target.value)}
          placeholder="Search..."
        />
        <view className="circle-search-button" bindtap={handleSearch}>
          <text className="circle-search-button-text">Search</text>
        </view>
      </view>
    </view>
  )
} 