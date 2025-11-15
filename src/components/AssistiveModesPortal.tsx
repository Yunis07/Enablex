import { 
  Mic, 
  Camera, 
  Ear, 
  MapPin, 
  X,
  ChevronRight 
} from "lucide-react";
import { Button } from "./ui/button";

interface AssistiveModesPortalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMode: (mode: string) => void;
}

export function AssistiveModesPortal({ isOpen, onClose, onSelectMode }: AssistiveModesPortalProps) {
  if (!isOpen) return null;

  const assistiveFeatures = [
    {
      id: 1,
      icon: Mic,
      title: "Voice Assistant",
      bgColor: "bg-gradient-to-br from-blue-400 to-blue-500",
    },
    {
      id: 2,
      icon: Camera,
      title: "Camera Guide",
      bgColor: "bg-gradient-to-br from-green-400 to-emerald-500",
    },
    {
      id: 3,
      icon: Ear,
      title: "Hearing Assist",
      bgColor: "bg-gradient-to-br from-purple-400 to-purple-500",
    },
    {
      id: 4,
      icon: MapPin,
      title: "EnableX Maps",
      bgColor: "bg-gradient-to-br from-orange-400 to-orange-500",
    },
  ];

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
                Assistive Modes
              </h1>
              <p className="text-white/95 mt-2 drop-shadow-md" style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                Choose your assistance
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
        <main className="flex-1 overflow-y-auto px-6 py-8 scroll-smooth">
          <div className="space-y-5">
            {assistiveFeatures.map((feature) => (
              <button
                key={feature.id}
                onClick={() => onSelectMode(feature.title)}
                className={`${feature.bgColor} rounded-3xl p-8 flex items-center gap-6 w-full shadow-xl hover:shadow-2xl active:scale-[0.96] transition-all duration-300 min-h-[140px] hover:scale-[1.02] animate-in slide-in-from-bottom`}
                style={{ animationDelay: `${feature.id * 100}ms` }}
              >
                <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-6 flex-shrink-0 shadow-lg">
                  <feature.icon className="w-16 h-16 text-white drop-shadow-lg" strokeWidth={3} />
                </div>
                
                <div className="flex-1 text-left">
                  <h2 className="text-white drop-shadow-md" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                    {feature.title}
                  </h2>
                </div>
                
                <ChevronRight className="w-10 h-10 text-white/90 flex-shrink-0 drop-shadow-md" strokeWidth={3} />
              </button>
            ))}
          </div>

          {/* Help Text */}
          <div className="mt-8 bg-purple-50 border-2 border-purple-200 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="bg-purple-100 rounded-xl p-2">
                <Mic className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-purple-900 mb-1">Need Help?</p>
                <p className="text-purple-700 text-sm leading-relaxed">
                  Say "Hey EnableX" to activate voice assistant anytime
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <div className="bg-white border-t-4 border-purple-200 px-6 py-6 shadow-2xl">
          <Button 
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-2xl py-8 shadow-xl hover:scale-105 transition-transform duration-200"
            style={{ fontSize: '1.2rem', fontWeight: 700 }}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
