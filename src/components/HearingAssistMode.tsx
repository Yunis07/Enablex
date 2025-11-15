import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, X, Volume2, Trash2 } from "lucide-react";
import { Button } from "./ui/button";

interface HearingAssistModeProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HearingAssistMode({ isOpen, onClose }: HearingAssistModeProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [transcriptHistory, setTranscriptHistory] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if browser supports Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setTranscriptHistory(prev => [...prev, finalTranscript.trim()]);
          setTranscript('');
          setError('');
        } else {
          setTranscript(interimTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        setIsListening(false);
        
        if (event.error === 'not-allowed') {
          setError('PERMISSION_DENIED');
        } else if (event.error === 'no-speech') {
          // Don't show error for no-speech, it's too common
          setError('');
        } else if (event.error === 'network') {
          setError('Network error. Please check your internet connection.');
        } else if (event.error === 'aborted') {
          // Ignore aborted errors (user stopped listening)
          setError('');
        } else {
          setError(`Error: ${event.error}. Please try again.`);
        }
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            setIsListening(false);
          }
        }
      };
    } else {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors on cleanup
        }
      }
    };
  }, [isListening]);

  const toggleListening = async () => {
    if (isListening) {
      try {
        recognitionRef.current?.stop();
        setIsListening(false);
        setError('');
      } catch (e) {
        // Silently handle stop errors
      }
    } else {
      setError('');
      // Request microphone permission first
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Stop the stream immediately as we only needed it for permission
        stream.getTracks().forEach(track => track.stop());
        
        if (recognitionRef.current) {
          recognitionRef.current.start();
          setIsListening(true);
        }
      } catch (err: any) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setError('PERMISSION_DENIED');
        } else if (err.name === 'NotFoundError') {
          setError('NO_MICROPHONE');
        } else {
          setError('GENERAL_ERROR');
        }
        // Don't log to console - the UI already shows the error
      }
    }
  };

  const clearHistory = () => {
    setTranscriptHistory([]);
    setTranscript('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Portal Content */}
      <div className="relative w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col" style={{ height: '844px' }}>
        
        {/* Header */}
        <header className="bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 px-6 pt-12 pb-8 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-white drop-shadow-lg" style={{ fontSize: '2rem', fontWeight: 800 }}>
                Hearing Assist
              </h1>
              <p className="text-white/95 mt-2 drop-shadow-md" style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                Speech to Text
              </p>
            </div>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={onClose}
              className="rounded-full bg-white/20 hover:bg-white/30 text-white w-14 h-14 shadow-lg backdrop-blur-sm"
            >
              <X className="w-8 h-8" strokeWidth={3} />
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden px-6 py-8 flex flex-col scroll-smooth">
          {/* Browser Support Check */}
          {!isSupported && (
            <div className="mb-6 bg-red-50 border-2 border-red-300 rounded-2xl p-6">
              <p className="text-red-900 text-lg text-center">
                Speech recognition is not supported in your browser. Please use Chrome, Safari, or Edge.
              </p>
            </div>
          )}

          {/* Error Message */}
          {error === 'PERMISSION_DENIED' && (
            <div className="mb-6 bg-orange-50 border-4 border-orange-400 rounded-3xl p-8">
              <div className="text-center mb-6">
                <div className="bg-orange-100 rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-4">
                  <Mic className="w-14 h-14 text-orange-600" strokeWidth={2.5} />
                </div>
                <h3 className="text-orange-900 text-2xl mb-3">Microphone Blocked</h3>
              </div>
              <div className="space-y-4 text-orange-900">
                <p className="text-lg text-center">You need to allow microphone access to use this feature</p>
                <div className="bg-white rounded-2xl p-6 space-y-3">
                  <p className="text-lg">📱 How to fix:</p>
                  <div className="space-y-2 text-base pl-4">
                    <p>1️⃣ Look for 🔒 in the address bar</p>
                    <p>2️⃣ Click it and find "Microphone"</p>
                    <p>3️⃣ Select "Allow"</p>
                    <p>4️⃣ Click "Start Listening" again</p>
                  </div>
                </div>
                <Button
                  onClick={() => setError('')}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-2xl py-6 text-lg"
                >
                  I've Enabled It - Try Again
                </Button>
              </div>
            </div>
          )}

          {error === 'NO_MICROPHONE' && (
            <div className="mb-6 bg-red-50 border-2 border-red-300 rounded-2xl p-6">
              <p className="text-red-900 text-lg text-center leading-relaxed">
                No microphone found. Please connect a microphone to your device.
              </p>
            </div>
          )}

          {error === 'GENERAL_ERROR' && (
            <div className="mb-6 bg-red-50 border-2 border-red-300 rounded-2xl p-6">
              <p className="text-red-900 text-lg leading-relaxed">
                Unable to access microphone. Please check your device settings and try again.
              </p>
            </div>
          )}

          {error && !['PERMISSION_DENIED', 'NO_MICROPHONE', 'GENERAL_ERROR'].includes(error) && (
            <div className="mb-6 bg-red-50 border-2 border-red-300 rounded-2xl p-6">
              <p className="text-red-900 text-lg leading-relaxed">{error}</p>
              <p className="text-red-700 text-sm mt-3">
                To enable microphone: Click the lock icon in your browser's address bar and allow microphone access.
              </p>
            </div>
          )}

          {/* Controls */}
          <div className="mb-6">
            <Button
              onClick={toggleListening}
              disabled={!isSupported}
              className={`w-full ${
                isListening 
                  ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' 
                  : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
              } text-white rounded-3xl py-10 shadow-lg transition-all ${
                isListening ? 'animate-pulse' : ''
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="flex items-center justify-center gap-4">
                {isListening ? (
                  <>
                    <MicOff className="w-10 h-10" strokeWidth={2.5} />
                    <span className="text-2xl">Stop Listening</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-10 h-10" strokeWidth={2.5} />
                    <span className="text-2xl">Start Listening</span>
                  </>
                )}
              </div>
            </Button>
          </div>

          {/* Current Transcript */}
          {(isListening || transcript) && (
            <div className="mb-6 bg-purple-50 border-2 border-purple-300 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Volume2 className="w-6 h-6 text-purple-600" />
                <p className="text-purple-900">Listening...</p>
              </div>
              <p className="text-purple-800 text-lg leading-relaxed min-h-[60px]">
                {transcript || 'Speak now...'}
              </p>
            </div>
          )}

          {/* Transcript History */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-neutral-700">Transcript History</h3>
            {transcriptHistory.length > 0 && (
              <Button
                onClick={clearHistory}
                variant="ghost"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Clear
              </Button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto -mx-6 px-6">
            <div className="space-y-3 pb-4">
              {transcriptHistory.length === 0 ? (
                <div className="text-center py-12 text-neutral-400">
                  <Mic className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg">No transcripts yet</p>
                  <p className="text-sm mt-2">Press "Start Listening" to begin</p>
                </div>
              ) : (
                transcriptHistory.map((text, index) => (
                  <div
                    key={index}
                    className="bg-white border-2 border-neutral-200 rounded-2xl p-5"
                  >
                    <p className="text-neutral-800 text-lg leading-relaxed">{text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <div className="bg-white border-t-4 border-purple-200 px-6 py-6 shadow-2xl">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-3 border-purple-300 rounded-2xl p-5 mb-4 shadow-md">
            <p className="text-purple-900 text-center" style={{ fontSize: '1.05rem', fontWeight: 600 }}>
              🎤 Speak clearly into your device microphone
            </p>
          </div>
          <Button 
            onClick={onClose}
            className="w-full bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-2xl py-7 shadow-lg hover:scale-105 transition-transform duration-200"
            style={{ fontSize: '1.1rem', fontWeight: 700 }}
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}
