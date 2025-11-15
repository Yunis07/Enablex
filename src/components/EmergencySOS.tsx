import { useState, useEffect, useRef } from "react";
import { X, AlertTriangle, Phone, MapPin, Check, XCircle } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner@2.0.3";

interface EmergencySOSProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Caregiver {
  id: string;
  name: string;
  phone: string;
  type: 'family' | 'doctor';
}

interface EventLog {
  id: string;
  message: string;
  timestamp: Date;
  type: 'sos' | 'fall' | 'cancelled' | 'ok';
}

export function EmergencySOS({ isOpen, onClose }: EmergencySOSProps) {
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [showFallConfirmation, setShowFallConfirmation] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [eventLog, setEventLog] = useState<EventLog[]>([]);
  const [isSOSActive, setIsSOSActive] = useState(false);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load caregivers from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('enablex_caregivers');
    if (saved) {
      setCaregivers(JSON.parse(saved));
    }
  }, [isOpen]);

  // Load event log
  useEffect(() => {
    const savedLog = localStorage.getItem('enablex_event_log');
    if (savedLog) {
      setEventLog(JSON.parse(savedLog).map((e: any) => ({
        ...e,
        timestamp: new Date(e.timestamp)
      })));
    }
  }, []);

  // Save event log
  useEffect(() => {
    localStorage.setItem('enablex_event_log', JSON.stringify(eventLog));
  }, [eventLog]);

  const addEventLog = (message: string, type: 'sos' | 'fall' | 'cancelled' | 'ok') => {
    const newEvent: EventLog = {
      id: Date.now().toString(),
      message,
      timestamp: new Date(),
      type
    };
    setEventLog(prev => [newEvent, ...prev].slice(0, 10)); // Keep last 10 events
  };

  const sendSOSAlert = (reason: string) => {
    const familyCaregivers = caregivers.filter(c => c.type === 'family');
    const allCaregivers = caregivers;

    // Prioritize family caregivers
    const priorityContacts = familyCaregivers.length > 0 ? familyCaregivers : allCaregivers;

    if (priorityContacts.length === 0) {
      toast.error("No caregivers added. Please add contacts first.");
      return;
    }

    // Try to get location from localStorage first (from maps tracking)
    const savedLocation = localStorage.getItem('enablex_current_location');
    
    if (savedLocation) {
      const location = JSON.parse(savedLocation);
      const mapUrl = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;
      
      priorityContacts.forEach(contact => {
        const message = `🚨 EMERGENCY ALERT 🚨\n\n${reason}\n\nUser needs immediate assistance!\n\n📍 Live Location: ${mapUrl}\n\nCoordinates: ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}\n\n⏰ Time: ${new Date().toLocaleString()}\n\nThis is an automated alert from EnableX.`;
        
        // Simulate SMS sending (in real app, this would use Twilio or similar)
        console.log(`SMS to ${contact.name} (${contact.phone}):\n${message}`);
        
        // Open SMS app with pre-filled message (works on mobile)
        const smsUrl = `sms:${contact.phone}?body=${encodeURIComponent(message)}`;
        window.location.href = smsUrl;
        
        toast.success(`Alert sent to ${contact.name}`, {
          description: contact.phone,
          duration: 3000,
        });
      });

      addEventLog(`SOS Alert sent to ${priorityContacts.length} contact(s): ${reason}`, 'sos');
    } else {
      // Get fresh location if not in localStorage
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const mapUrl = `https://www.google.com/maps/search/?api=1&query=${position.coords.latitude},${position.coords.longitude}`;
            
            priorityContacts.forEach(contact => {
              const message = `🚨 EMERGENCY ALERT 🚨\n\n${reason}\n\nUser needs immediate assistance!\n\n📍 Live Location: ${mapUrl}\n\nCoordinates: ${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}\n\n⏰ Time: ${new Date().toLocaleString()}\n\nThis is an automated alert from EnableX.`;
              
              console.log(`SMS to ${contact.name} (${contact.phone}):\n${message}`);
              
              const smsUrl = `sms:${contact.phone}?body=${encodeURIComponent(message)}`;
              window.location.href = smsUrl;
              
              toast.success(`Alert sent to ${contact.name}`, {
                description: contact.phone,
                duration: 3000,
              });
            });

            addEventLog(`SOS Alert sent to ${priorityContacts.length} contact(s): ${reason}`, 'sos');
          },
          (error) => {
            // Send without location if geolocation fails
            priorityContacts.forEach(contact => {
              const message = `🚨 EMERGENCY ALERT 🚨\n\n${reason}\n\nUser needs immediate assistance!\n\n📍 Location: Unable to retrieve\n\n⏰ Time: ${new Date().toLocaleString()}\n\nThis is an automated alert from EnableX.`;
              
              console.log(`SMS to ${contact.name} (${contact.phone}):\n${message}`);
              
              const smsUrl = `sms:${contact.phone}?body=${encodeURIComponent(message)}`;
              window.location.href = smsUrl;
              
              toast.success(`Alert sent to ${contact.name}`, {
                description: contact.phone,
                duration: 3000,
              });
            });

            addEventLog(`SOS Alert sent to ${priorityContacts.length} contact(s): ${reason}`, 'sos');
          }
        );
      }
    }
  };

  const triggerSOS = () => {
    setIsSOSActive(true);
    sendSOSAlert("SOS Button Pressed");
    
    // Visual and audio feedback
    toast.error("🚨 SOS ACTIVATED!", {
      description: "Emergency alerts being sent to all caregivers",
      duration: 5000,
    });

    // Reset after 3 seconds
    setTimeout(() => {
      setIsSOSActive(false);
    }, 3000);
  };

  const simulateFall = () => {
    setShowFallConfirmation(true);
    setCountdown(10);
    
    // Start countdown
    countdownIntervalRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          // Auto-send alert after countdown
          handleFallTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    addEventLog("Fall detected! Countdown started.", 'fall');
  };

  const handleFallTimeout = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    setShowFallConfirmation(false);
    sendSOSAlert("FALL DETECTED - User did not respond");
    setCountdown(10);
  };

  const handleImFine = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    setShowFallConfirmation(false);
    setCountdown(10);
    addEventLog("Fall alert cancelled - User confirmed they're OK", 'ok');
    toast.success("Alert cancelled - You're marked as OK");
  };

  const handleCancelAlert = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    setShowFallConfirmation(false);
    setCountdown(10);
    addEventLog("Fall alert cancelled by user", 'cancelled');
    toast.info("Alert cancelled");
  };

  const callCaregiver = () => {
    const familyCaregivers = caregivers.filter(c => c.type === 'family');
    const primaryContact = familyCaregivers.length > 0 ? familyCaregivers[0] : caregivers[0];

    if (primaryContact) {
      // In a real app, this would initiate a phone call
      window.location.href = `tel:${primaryContact.phone}`;
      addEventLog(`Called ${primaryContact.name}`, 'sos');
    } else {
      toast.error("No caregivers available to call");
    }
  };

  const shareLocation = () => {
    // Try to get location from localStorage first
    const savedLocation = localStorage.getItem('enablex_current_location');
    
    if (savedLocation) {
      const location = JSON.parse(savedLocation);
      const mapUrl = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;
      
      // Copy to clipboard
      navigator.clipboard.writeText(mapUrl);
      toast.success("Location copied to clipboard!", {
        description: "Share this link with your caregivers",
        duration: 4000,
      });

      addEventLog("Location shared", 'sos');

      // Send via SMS to caregivers
      const familyCaregivers = caregivers.filter(c => c.type === 'family');
      const priorityContacts = familyCaregivers.length > 0 ? familyCaregivers : caregivers;

      priorityContacts.forEach(contact => {
        const message = `📍 Live Location Shared\n\nView my current location: ${mapUrl}\n\nShared at: ${new Date().toLocaleString()}`;
        console.log(`Location SMS to ${contact.name}: ${message}`);
      });
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const mapUrl = `https://www.google.com/maps/search/?api=1&query=${position.coords.latitude},${position.coords.longitude}`;
          
          // Copy to clipboard
          navigator.clipboard.writeText(mapUrl);
          toast.success("Location copied to clipboard!", {
            description: "Share this link with your caregivers",
            duration: 4000,
          });

          addEventLog("Location shared", 'sos');

          // Send via SMS
          const familyCaregivers = caregivers.filter(c => c.type === 'family');
          const priorityContacts = familyCaregivers.length > 0 ? familyCaregivers : caregivers;

          priorityContacts.forEach(contact => {
            const message = `📍 Live Location Shared\n\nView my current location: ${mapUrl}\n\nShared at: ${new Date().toLocaleString()}`;
            console.log(`Location SMS to ${contact.name}: ${message}`);
          });
        },
        (error) => {
          toast.error("Unable to get location", {
            description: "Please enable location services",
          });
        }
      );
    } else {
      toast.error("Geolocation not supported");
    }
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Portal Content */}
        <div className="relative w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col" style={{ height: '844px' }}>
          
          {/* Header */}
          <header className="bg-gradient-to-r from-red-600 via-red-700 to-rose-700 px-6 pt-12 pb-8 text-white shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-white drop-shadow-lg" style={{ fontSize: '2rem', fontWeight: 800 }}>
                  Emergency SOS
                </h1>
                <p className="text-white/95 mt-2 drop-shadow-md" style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                  Fall Detection & Alerts
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
          <main className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto px-6 py-6 scroll-smooth">
              <div className="space-y-4 pb-4">
                {/* SOS NOW Button */}
                <Button
                  onClick={triggerSOS}
                  disabled={isSOSActive}
                  className={`w-full ${
                    isSOSActive 
                      ? 'bg-red-700 animate-pulse' 
                      : 'bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800'
                  } text-white rounded-3xl py-12 shadow-2xl transition-all`}
                >
                  <div className="flex flex-col items-center">
                    <AlertTriangle className="w-16 h-16 mb-3" strokeWidth={2.5} />
                    <span className="text-3xl">{isSOSActive ? 'SENDING...' : 'SOS NOW'}</span>
                  </div>
                </Button>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 gap-3">
                  <Button
                    onClick={callCaregiver}
                    disabled={caregivers.length === 0}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-8 shadow-md"
                  >
                    <Phone className="w-8 h-8 mr-3" strokeWidth={2.5} />
                    <span className="text-xl">Call Caregiver</span>
                  </Button>

                  <Button
                    onClick={shareLocation}
                    className="bg-green-600 hover:bg-green-700 text-white rounded-2xl py-8 shadow-md"
                  >
                    <MapPin className="w-8 h-8 mr-3" strokeWidth={2.5} />
                    <span className="text-xl">Share Live Location</span>
                  </Button>

                  <Button
                    onClick={simulateFall}
                    className="bg-orange-600 hover:bg-orange-700 text-white rounded-2xl py-8 shadow-md"
                  >
                    <AlertTriangle className="w-8 h-8 mr-3" strokeWidth={2.5} />
                    <span className="text-xl">Simulate Fall</span>
                  </Button>
                </div>

                {/* Caregiver Contacts Info */}
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5 mt-4">
                  <h3 className="text-red-900 mb-2">Emergency Contacts</h3>
                  {caregivers.length === 0 ? (
                    <p className="text-red-700">⚠️ No caregivers added. Add contacts to receive alerts.</p>
                  ) : (
                    <>
                      <p className="text-red-700 mb-3">
                        Alerts will be sent to {caregivers.filter(c => c.type === 'family').length > 0 
                          ? `${caregivers.filter(c => c.type === 'family').length} family contact(s) first` 
                          : `${caregivers.length} contact(s)`}
                      </p>
                      <div className="space-y-2">
                        {caregivers.filter(c => c.type === 'family').slice(0, 3).map(c => (
                          <div key={c.id} className="bg-white rounded-xl px-4 py-2 flex items-center justify-between">
                            <span className="text-neutral-800">{c.name}</span>
                            <span className="text-neutral-600 text-sm">{c.phone}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Event Log */}
                <div className="bg-neutral-50 border-2 border-neutral-200 rounded-2xl p-5">
                  <h3 className="text-neutral-800 mb-3">Event Log</h3>
                  {eventLog.length === 0 ? (
                    <p className="text-neutral-500 text-center py-4">No events logged yet</p>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {eventLog.map(event => (
                        <div
                          key={event.id}
                          className={`p-3 rounded-xl text-sm ${
                            event.type === 'sos' ? 'bg-red-100 text-red-900' :
                            event.type === 'fall' ? 'bg-orange-100 text-orange-900' :
                            event.type === 'ok' ? 'bg-green-100 text-green-900' :
                            'bg-neutral-100 text-neutral-800'
                          }`}
                        >
                          <p className="leading-snug">{event.message}</p>
                          <p className="text-xs opacity-75 mt-1">
                            {event.timestamp.toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>

          {/* Footer */}
          <div className="bg-white border-t-2 border-neutral-100 px-6 py-6">
            <Button 
              onClick={onClose}
              className="w-full bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-2xl py-6 shadow-md"
            >
              Back
            </Button>
          </div>
        </div>
      </div>

      {/* Fall Confirmation Overlay */}
      {showFallConfirmation && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
          <div className="absolute inset-0 bg-black/80" />
          <div className="relative w-full max-w-md bg-gradient-to-br from-red-600 to-rose-700 rounded-[3rem] shadow-2xl p-12 text-white text-center">
            <div className="mb-8">
              <AlertTriangle className="w-24 h-24 mx-auto mb-6 animate-bounce" strokeWidth={2.5} />
              <h1 className="text-white mb-6 text-3xl">Fall detected!</h1>
              <p className="text-white/90 text-2xl mb-8">Are you okay?</p>
            </div>

            <div className="bg-white/20 rounded-3xl p-8 mb-8">
              <p className="text-white/80 mb-4 text-xl">Sending alert in:</p>
              <div className="text-8xl text-white animate-pulse mb-2">
                {countdown}
              </div>
              <p className="text-white/70 text-lg">seconds</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={handleImFine}
                className="bg-green-500 hover:bg-green-600 text-white rounded-2xl py-10 shadow-lg text-xl h-auto"
              >
                <div className="flex flex-col items-center">
                  <Check className="w-10 h-10 mb-2" strokeWidth={3} />
                  <span>I'm Fine</span>
                </div>
              </Button>
              <Button
                onClick={handleCancelAlert}
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-2xl py-10 shadow-lg text-xl h-auto"
              >
                <div className="flex flex-col items-center">
                  <XCircle className="w-10 h-10 mb-2" strokeWidth={3} />
                  <span>Cancel Alert</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
