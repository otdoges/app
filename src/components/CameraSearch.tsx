import { useState, useEffect, useRef } from '@lynx-js/react';
import '../styles/CameraSearch.css';

interface CameraSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CameraSearch({ isOpen, onClose }: CameraSearchProps) {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (isOpen && !cameraReady && !capturedImage) {
      initCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const initCamera = async () => {
    setError('');
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setCameraReady(true);
        };
      }
    } catch (err) {
      console.error('Camera initialization error:', err);
      setError('Could not access the camera. Please check permissions and try again.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => {
        track.stop();
      });
      
      videoRef.current.srcObject = null;
      setCameraReady(false);
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the current video frame on the canvas
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to data URL
      const imageDataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageDataUrl);
      
      // Stop the camera stream
      stopCamera();
    }
  };

  const resetCamera = () => {
    setCapturedImage(null);
    initCamera();
  };

  const searchWithImage = async () => {
    if (!capturedImage) return;
    
    setIsLoading(true);
    
    try {
      // In a real app, this would call your Go backend API to process the image
      // For now, just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Display success or results
      onClose();
    } catch (err) {
      setError('Failed to process the image. Please try again.');
      console.error('Image search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <view className="camera-search-container">
      <view className="camera-search-backdrop" bindtap={onClose}></view>
      <view className="camera-search-modal">
        <view className="camera-search-header">
          <text className="camera-search-title">Camera Search</text>
          <view className="camera-search-close" bindtap={onClose}>
            <text>×</text>
          </view>
        </view>
        
        <view className="camera-search-content">
          {!cameraReady && !capturedImage && !error && (
            <view className="camera-search-placeholder">
              <view className="camera-placeholder-icon">📷</view>
              <text className="camera-placeholder-text">
                Initializing camera...
              </text>
            </view>
          )}
          
          {error && (
            <view className="camera-search-error">
              <text className="camera-search-error-text">{error}</text>
            </view>
          )}
          
          {cameraReady && !capturedImage && (
            <>
              <video 
                ref={videoRef}
                className="camera-search-video"
                autoPlay={true}
                muted={true}
              ></video>
              
              <view className="camera-search-controls">
                <view className="camera-search-button camera-search-capture" bindtap={captureImage}>
                  <view className="camera-search-button-icon">📸</view>
                  <text>Capture</text>
                </view>
              </view>
            </>
          )}
          
          {capturedImage && (
            <>
              <img 
                src={capturedImage} 
                className="camera-search-preview" 
                alt="Captured image" 
              />
              
              <view className="camera-search-controls">
                <view 
                  className="camera-search-button camera-search-retry" 
                  bindtap={resetCamera}
                >
                  <view className="camera-search-button-icon">🔄</view>
                  <text>Retry</text>
                </view>
                
                <view 
                  className="camera-search-button camera-search-capture" 
                  bindtap={searchWithImage}
                >
                  <view className="camera-search-button-icon">🔍</view>
                  <text>Search</text>
                </view>
              </view>
            </>
          )}
          
          <canvas ref={canvasRef} className="camera-search-canvas"></canvas>
        </view>
        
        {isLoading && (
          <view className="camera-search-loading">
            <view className="camera-search-spinner"></view>
            <text className="camera-search-loading-text">Processing image...</text>
          </view>
        )}
      </view>
    </view>
  );
} 