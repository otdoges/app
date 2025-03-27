import { useCallback, useState } from '@lynx-js/react'
import '../styles/Translation.css'

interface TranslationProps {
  onClose: () => void
}

export function Translation({ onClose }: TranslationProps) {
  const [text, setText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [targetLanguage, setTargetLanguage] = useState('en')
  
  const handleTranslate = useCallback(async () => {
    if (!text.trim()) return
    
    try {
      // This is a placeholder for actual translation API call
      // In a real app, you would call an actual translation service
      setTranslatedText(`Translated: ${text} (to ${targetLanguage})`)
    } catch (error) {
      console.error('Translation error:', error)
    }
  }, [text, targetLanguage])
  
  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'zh', label: 'Chinese' },
  ]
  
  return (
    <view className="translation-container">
      <view className="translation-backdrop" bindtap={onClose} />
      <view className="translation-modal">
        <view className="translation-header">
          <text className="translation-title">Live Translation</text>
          <view className="translation-close" bindtap={onClose}>
            <text>✕</text>
          </view>
        </view>
        
        <view className="translation-content">
          <view className="translation-input-group">
            <textarea 
              className="translation-input" 
              placeholder="Enter text to translate..."
              value={text}
              oninput={(e) => setText(e.target.value)}
            />
            
            <view className="translation-language-select">
              <text>Translate to:</text>
              <select 
                value={targetLanguage} 
                onchange={(e) => setTargetLanguage(e.target.value)}
              >
                {languages.map(lang => (
                  <option key={lang.value} value={lang.value}>{lang.label}</option>
                ))}
              </select>
            </view>
            
            <view className="translation-button" bindtap={handleTranslate}>
              <text>Translate</text>
            </view>
          </view>
          
          {translatedText && (
            <view className="translation-result">
              <text className="translation-result-text">{translatedText}</text>
            </view>
          )}
        </view>
      </view>
    </view>
  )
} 