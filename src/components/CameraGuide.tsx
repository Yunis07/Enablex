import { useState, useRef, useEffect } from "react";
import { X, Camera, ScanText, Loader2, ZoomIn, ZoomOut, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner@2.0.3";
import Tesseract from 'tesseract.js';

interface CameraGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CameraGuide({ isOpen, onClose }: CameraGuideProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [isStreaming, setIsStreaming] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognizedText, setRecognizedText] = useState<string>("");
  const [cameraError, setCameraError] = useState<string>("");
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    
    return () => stopCamera();
  }, [isOpen]);

  const startCamera = async () => {
    try {
      setCameraError("");
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
        toast.success("Camera activated");
      }
    } catch (error) {
      console.error("Camera access error:", error);
      setCameraError("Unable to access camera. Please check permissions.");
      toast.error("Camera access denied");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsStreaming(false);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const captureAndRecognize = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsProcessing(true);
    setRecognizedText("");
    
    try {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob(async (blob) => {
          if (!blob) {
            toast.error("Failed to capture image");
            setIsProcessing(false);
            return;
          }

          toast.info("Reading text...");
          
          try {
            const result = await Tesseract.recognize(
              blob,
              'eng',
              {
                logger: (m) => {
                  if (m.status === 'recognizing text') {
                    console.log(`Progress: ${(m.progress * 100).toFixed(0)}%`);
                  }
                }
              }
            );

            const text = result.data.text.trim();
            
            if (text) {
              setRecognizedText(text);
              toast.success("Text recognized!");
              
              // Speak the text
              if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.rate = 0.8;
                utterance.pitch = 1;
                utterance.volume = 1;
                window.speechSynthesis.speak(utterance);
              }
            } else {
              setRecognizedText("No text found in image");
              toast.warning("No text detected");
            }
          } catch (error) {
            console.error("OCR error:", error);
            toast.error("Failed to read text");
            setRecognizedText("Error reading text. Please try again.");
          } finally {
            setIsProcessing(false);
          }
        }, 'image/png');
      }
    } catch (error) {
      console.error("Capture error:", error);
      toast.error("Failed to capture image");
      setIsProcessing(false);
    }
  };

  const adjustZoom = (newZoom: number) => {
    setZoom(newZoom);
    if (videoRef.current) {
      videoRef.current.style.transform = `scale(${newZoom})`;
    }
  };

  const speakText = () => {
    if (recognizedText && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(recognizedText);
      utterance.rate = 0.7;
      utterance.pitch = 1;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Portal Content */}
      <div className="relative w-full max-w-md bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col" style={{ height: '844px' }}>
        
        {/* Header */}
        <header className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 pt-12 pb-6 text-white relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1">
              <h1 className="text-white mb-1">Camera Guide</h1>
              <p className="text-white/90">Point at text to read</p>
            </div>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={onClose}
              className="rounded-full bg-white/20 hover:bg-white/30 text-white w-12 h-12"
            >
              <X className="w-7 h-7" strokeWidth={2.5} />
            </Button>
          </div>
        </header>

        {/* Camera View */}
        <main className="flex-1 relative bg-black overflow-hidden">
          {cameraError ? (
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="text-center">
                <Camera className="w-20 h-20 text-red-400 mx-auto mb-4" />
                <p className="text-white text-xl mb-2">Camera Not Available</p>
                <p className="text-white/70">{cameraError}</p>
                <Button
                  onClick={startCamera}
                  className="mt-6 bg-green-600 hover:bg-green-700 text-white rounded-2xl py-6 px-8"
                >
                  <RefreshCw className="w-6 h-6 mr-2" />
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover transition-transform duration-300"
                style={{ transform: `scale(${zoom})` }}
              />
              
              <canvas ref={canvasRef} className="hidden" />

              {/* Camera Controls Overlay */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                <div className="flex gap-2">
                  <Button
                    onClick={() => adjustZoom(Math.max(1, zoom - 0.2))}
                    disabled={zoom <= 1}
                    className="bg-black/50 hover:bg-black/70 text-white border-2 border-white/30 rounded-xl w-12 h-12 p-0"
                  >
                    <ZoomOut className="w-6 h-6" />
                  </Button>
                  <Button
                    onClick={() => adjustZoom(Math.min(3, zoom + 0.2))}
                    disabled={zoom >= 3}
                    className="bg-black/50 hover:bg-black/70 text-white border-2 border-white/30 rounded-xl w-12 h-12 p-0"
                  >
                    <ZoomIn className="w-6 h-6" />
                  </Button>
                </div>

                {isStreaming && (
                  <div className="bg-red-500 px-4 py-2 rounded-full flex items-center gap-2 animate-pulse">
                    <div className="w-3 h-3 bg-white rounded-full" />
                    <span className="text-white">LIVE</span>
                  </div>
                )}
              </div>

              {/* Scan Frame */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-4/5 h-1/2 border-4 border-green-400 rounded-3xl shadow-lg">
                  <div className="absolute top-0 left-0 w-12 h-12 border-t-8 border-l-8 border-green-400 rounded-tl-3xl" />
                  <div className="absolute top-0 right-0 w-12 h-12 border-t-8 border-r-8 border-green-400 rounded-tr-3xl" />
                  <div className="absolute bottom-0 left-0 w-12 h-12 border-b-8 border-l-8 border-green-400 rounded-bl-3xl" />
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-b-8 border-r-8 border-green-400 rounded-br-3xl" />
                </div>
              </div>

              {/* Recognized Text Display */}
              {recognizedText && (
                <div className="absolute bottom-24 left-4 right-4 z-10 animate-in slide-in-from-bottom duration-500">
                  <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-2xl border-4 border-green-400">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-green-900">Recognized Text:</h3>
                      <Button
                        onClick={speakText}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white rounded-xl"
                      >
                        🔊 Read Aloud
                      </Button>
                    </div>
                    <p className="text-neutral-800 max-h-32 overflow-y-auto leading-relaxed">
                      {recognizedText}
                    </p>
                  </div>
                </div>
              )}

              {/* Processing Indicator */}
              {isProcessing && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                  <div className="bg-white rounded-3xl p-8 text-center">
                    <Loader2 className="w-16 h-16 text-green-600 animate-spin mx-auto mb-4" />
                    <p className="text-green-900">Reading text...</p>
                    <p className="text-neutral-600 text-sm mt-2">Please wait</p>
                  </div>
                </div>
              )}
            </>
          )}
        </main>

        {/* Footer Controls */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-6 border-t-4 border-white/20">
          <Button
            onClick={captureAndRecognize}
            disabled={!isStreaming || isProcessing}
            className="w-full bg-white hover:bg-white/90 text-green-700 rounded-2xl py-8 mb-3 shadow-lg disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-8 h-8 mr-3 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <ScanText className="w-8 h-8 mr-3" strokeWidth={2.5} />
                Scan & Read Text
              </>
            )}
          </Button>
          
          <Button 
            onClick={onClose}
            className="w-full bg-white/20 hover:bg-white/30 text-white border-2 border-white rounded-2xl py-6 shadow-md"
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}
