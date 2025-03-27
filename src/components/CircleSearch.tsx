import { useCallback, useState } from '@lynx-js/react'
import '../styles/CircleSearch.css'

interface CircleSearchProps {
  onSearch: (query: string) => void
  onClose: () => void
}

export function CircleSearch({ onSearch, onClose }: CircleSearchProps) {
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
          onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
          placeholder="Search..."
        />
        <view className="circle-search-button" bindtap={handleSearch}>
          <text className="circle-search-button-text">Search</text>
        </view>
      </view>
    </view>
  )
} 