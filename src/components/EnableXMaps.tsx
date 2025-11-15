import { useState, useEffect } from "react";
import { X, Navigation, MapPin, Crosshair, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner@2.0.3";

interface EnableXMapsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EnableXMaps({ isOpen, onClose }: EnableXMapsProps) {
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationError, setLocationError] = useState<string>("");
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    if (isOpen) {
      startLocationTracking();
    }
    return () => {
      setIsTracking(false);
    };
  }, [isOpen]);

  const startLocationTracking = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      toast.error("Location not supported");
      return;
    }

    setIsTracking(true);
    
    // Get current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setCurrentLocation(location);
        // Save to localStorage for SOS access
        localStorage.setItem('enablex_current_location', JSON.stringify(location));
        toast.success("Location updated");
      },
      (error) => {
        setLocationError("Unable to retrieve your location");
        toast.error("Please enable location services");
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );

    // Watch position for continuous tracking
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setCurrentLocation(location);
        localStorage.setItem('enablex_current_location', JSON.stringify(location));
      },
      (error) => {
        console.error("Location tracking error:", error);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  };

  const openInGoogleMaps = () => {
    if (currentLocation) {
      const url = `https://www.google.com/maps/search/?api=1&query=${currentLocation.lat},${currentLocation.lng}`;
      window.open(url, '_blank');
    } else {
      toast.error("Location not available");
    }
  };

  const getMapEmbedUrl = () => {
    if (currentLocation) {
      return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15000!2d${currentLocation.lng}!3d${currentLocation.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1763191129179!5m2!1sen!2sin`;
    }
    // Default to India view
    return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30773826.5103148!2d61.01044735812138!3d19.688315932838698!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30635ff06b92b791%3A0xd78c4fa1854213a6!2sIndia!5e0!3m2!1sen!2sin!4v1763191129179!5m2!1sen!2sin";
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
        <header className="bg-gradient-to-r from-orange-500 via-orange-600 to-rose-500 px-6 pt-12 pb-8 text-white relative z-10 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-white drop-shadow-lg" style={{ fontSize: '2rem', fontWeight: 800 }}>
                EnableX Maps
              </h1>
              <p className="text-white/95 mt-2 drop-shadow-md flex items-center gap-2" style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                {isTracking ? (
                  <>
                    <span className="inline-block w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                    Live Tracking
                  </>
                ) : (
                  "Navigation & Location"
                )}
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

        {/* Map Container */}
        <main className="flex-1 relative">
          {locationError && (
            <div className="absolute top-4 left-4 right-4 z-10 bg-red-50 border-2 border-red-300 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-600" />
                <p className="text-red-900 text-sm">{locationError}</p>
              </div>
            </div>
          )}

          <iframe 
            src={getMapEmbedUrl()}
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="EnableX Maps"
          />
          
          {/* Map Info Overlay */}
          {currentLocation && (
            <div className="absolute bottom-6 left-6 right-6 z-10">
              <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-orange-200">
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-green-100 rounded-xl p-3">
                    <MapPin className="w-6 h-6 text-green-600 animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <p className="text-neutral-800 mb-1">Current Location</p>
                    <p className="text-neutral-600 text-sm">
                      {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={openInGoogleMaps}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-3"
                >
                  <Navigation className="w-5 h-5 mr-2" />
                  Open in Google Maps
                </Button>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <div className="bg-white border-t-4 border-orange-200 px-6 py-6 shadow-2xl">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Button
              onClick={startLocationTracking}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl py-7 shadow-xl hover:scale-105 transition-transform duration-200"
              style={{ fontSize: '1.1rem', fontWeight: 700 }}
            >
              <Crosshair className="w-7 h-7 mr-2" strokeWidth={3} />
              Update
            </Button>
            <Button
              onClick={openInGoogleMaps}
              disabled={!currentLocation}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl py-7 shadow-xl hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:scale-100"
              style={{ fontSize: '1.1rem', fontWeight: 700 }}
            >
              <MapPin className="w-7 h-7 mr-2" strokeWidth={3} />
              Navigate
            </Button>
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
