// Camera Service for camera-based search

/**
 * Initialize camera and return stream and controls
 * @param {HTMLVideoElement} videoElement - Video element to display camera feed
 * @param {object} constraints - Camera constraints
 * @returns {Promise<object>} - Camera stream and controls
 */
export async function initCamera(videoElement, constraints = { video: { facingMode: 'environment' } }) {
  try {
    // Request camera permission and get stream
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    
    // Set video element source and play
    videoElement.srcObject = stream;
    await videoElement.play();
    
    return {
      stream,
      stop: () => {
        stream.getTracks().forEach(track => track.stop());
        videoElement.srcObject = null;
      },
      takePhoto: () => takePhoto(videoElement)
    };
  } catch (error) {
    console.error('Error accessing camera:', error);
    throw error;
  }
}

/**
 * Take a photo from video stream
 * @param {HTMLVideoElement} videoElement - Video element with camera stream
 * @returns {string} - Base64 encoded photo
 */
function takePhoto(videoElement) {
  // Create canvas with video dimensions
  const canvas = document.createElement('canvas');
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  
  // Draw current video frame to canvas
  const context = canvas.getContext('2d');
  context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  
  // Convert to data URL (base64)
  return canvas.toDataURL('image/jpeg');
}

/**
 * Detect text in image
 * @param {string} imageBase64 - Base64 encoded image
 * @returns {Promise<string>} - Detected text
 */
export async function detectText(imageBase64) {
  // In a real implementation, this would use an OCR service
  // For demo purposes, we're returning a mock result
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('Sample detected text from image');
    }, 1000);
  });
} 