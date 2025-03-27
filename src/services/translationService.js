// Translation Service with mic support
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

/**
 * Translate text from source language to target language
 * @param {string} text - Text to translate
 * @param {string} sourceLang - Source language code
 * @param {string} targetLang - Target language code
 * @returns {Promise<string>} - Translated text
 */
export async function translateText(text, sourceLang = 'auto', targetLang = 'en') {
  try {
    const response = await fetch(`${BACKEND_URL}/api/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text,
        sourceLang,
        targetLang
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.translatedText;
  } catch (error) {
    console.error('Error translating text:', error);
    return 'Translation error. Please try again.';
  }
}

/**
 * Start speech recognition for translation
 * @param {function} onResult - Callback function for results
 * @param {function} onError - Callback function for errors
 * @returns {object} - Speech recognition controller
 */
export function startSpeechRecognition(onResult, onError) {
  // Check if speech recognition is available
  if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
    onError('Speech recognition not supported in this browser');
    return null;
  }

  // Create speech recognition instance
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  
  // Configure
  recognition.continuous = true;
  recognition.interimResults = true;
  
  // Set up event handlers
  recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map(result => result[0].transcript)
      .join('');
      
    onResult(transcript);
  };
  
  recognition.onerror = (event) => {
    onError(`Speech recognition error: ${event.error}`);
  };
  
  // Start listening
  recognition.start();
  
  // Return controller to stop recognition later
  return {
    stop: () => recognition.stop()
  };
} 