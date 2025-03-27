import { useCallback, useState, useRef, useEffect } from '@lynx-js/react'
import { translateText, startSpeechRecognition } from '../services/translationService.js'
import '../styles/Translation.css'

export function Translation({ onClose }) {
  const [sourceText, setSourceText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [sourceLang, setSourceLang] = useState('auto')
  const [targetLang, setTargetLang] = useState('en')
  const [isTranslating, setIsTranslating] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState('')
  const speechRecognitionRef = useRef(null)
  
  // Stop speech recognition on component unmount
  useEffect(() => {
    return () => {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
    };
  }, []);
  
  const handleTranslate = useCallback(async () => {
    if (!sourceText.trim()) return;
    
    try {
      setIsTranslating(true);
      setError('');
      
      const result = await translateText(sourceText, sourceLang, targetLang);
      setTranslatedText(result);
    } catch (err) {
      setError('Translation failed. Please try again.');
      console.error('Translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  }, [sourceText, sourceLang, targetLang]);
  
  const handleMicToggle = useCallback(() => {
    if (isListening) {
      // Stop listening
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
        speechRecognitionRef.current = null;
      }
      setIsListening(false);
    } else {
      // Start listening
      const recognition = startSpeechRecognition(
        // On result
        (transcript) => {
          setSourceText(transcript);
        },
        // On error
        (error) => {
          setError(error);
          setIsListening(false);
        }
      );
      
      if (recognition) {
        speechRecognitionRef.current = recognition;
        setIsListening(true);
        setError('');
      }
    }
  }, [isListening]);
  
  const handleSwapLanguages = useCallback(() => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
    
    // Also swap the text
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  }, [sourceLang, targetLang, sourceText, translatedText]);
  
  const handleClear = useCallback(() => {
    setSourceText('');
    setTranslatedText('');
  }, []);
  
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
          <view className="translation-language-selector">
            <select 
              className="translation-language-select" 
              value={sourceLang}
              onchange={(e) => setSourceLang(e.target.value)}
            >
              <option value="auto">Auto Detect</option>
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="ja">Japanese</option>
              <option value="zh">Chinese</option>
            </select>
            
            <view className="translation-swap" bindtap={handleSwapLanguages}>
              <text>⇄</text>
            </view>
            
            <select 
              className="translation-language-select" 
              value={targetLang}
              onchange={(e) => setTargetLang(e.target.value)}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="ja">Japanese</option>
              <option value="zh">Chinese</option>
            </select>
          </view>
          
          <view className="translation-input-section">
            <textarea 
              className="translation-input"
              placeholder="Enter text to translate"
              value={sourceText}
              oninput={(e) => setSourceText(e.target.value)}
            />
            
            <view 
              className={`translation-mic-button ${isListening ? 'active' : ''}`}
              bindtap={handleMicToggle}
            >
              <text>{isListening ? '🔴' : '🎤'}</text>
            </view>
            
            <view className="translation-clear" bindtap={handleClear}>
              <text>✖</text>
            </view>
          </view>
          
          <view className="translation-controls">
            <view 
              className="translation-button" 
              bindtap={handleTranslate}
              disabled={!sourceText.trim() || isTranslating}
            >
              {isTranslating ? (
                <view className="translation-spinner" />
              ) : (
                <text className="translation-button-text">Translate</text>
              )}
            </view>
          </view>
          
          {error && (
            <view className="translation-error">
              <text>{error}</text>
            </view>
          )}
          
          {translatedText && (
            <view className="translation-result">
              <text className="translation-result-label">Translation:</text>
              <view className="translation-result-text">
                <text>{translatedText}</text>
              </view>
            </view>
          )}
        </view>
      </view>
    </view>
  )
} 
} 