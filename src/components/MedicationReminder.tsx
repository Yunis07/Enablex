import { useState, useEffect, useRef } from "react";
import { X, Plus, Trash2, Edit2, Check, Clock, Bell, Volume2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Howl } from 'howler';

interface MedicationReminderProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Medicine {
  id: string;
  name: string;
  times: string[];
}

interface AlertData {
  medicineName: string;
  time: string;
}

// Create notification sound using Howler
const notificationSound = new Howl({
  src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZUQ4OVqzn77BdGAg+ltryxnMnBSl+zPLaizsIGGS57OihUhALTKXh8bllHAU2jdXyzn0vBSh2xfDdkkILElyx6OyrWBUIQ5zd8sFuJAYugtDzzIMwBx1rwO7mnFIPC1Gn5e+zYBoGPJPY88p2KwUofsvy2Y0+CRdiv+3pp1QQC0mi4POyYR8FNYzU8tGAMAYeb8Lu5qBQDwxPpuXts2IbBjuR1vPKeC0GKXvM8tyNPwgYYLzs6KdUEAtJouDzsGIfBTWMz/PUgjEHHm/F7Oaez/8I'], 
  volume: 1.0,
  loop: true
});

export function MedicationReminder({ isOpen, onClose }: MedicationReminderProps) {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [newMedicineName, setNewMedicineName] = useState("");
  const [newMedicineTimes, setNewMedicineTimes] = useState<string[]>([""]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState<AlertData | null>(null);
  const soundIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load medicines
  useEffect(() => {
    const saved = localStorage.getItem('enablex_medicines');
    if (saved) {
      setMedicines(JSON.parse(saved));
    }
  }, []);

  const addTimeSlot = () => {
    setNewMedicineTimes([...newMedicineTimes, ""]);
  };

  const updateTimeSlot = (index: number, value: string) => {
    const updated = [...newMedicineTimes];
    updated[index] = value;
    setNewMedicineTimes(updated);
  };

  const removeTimeSlot = (index: number) => {
    if (newMedicineTimes.length > 1) {
      setNewMedicineTimes(newMedicineTimes.filter((_, i) => i !== index));
    }
  };

  const saveMedicine = () => {
    if (newMedicineName.trim() && newMedicineTimes.some(t => t.trim())) {
      const validTimes = newMedicineTimes.filter(t => t.trim());
      const newMedicine: Medicine = {
        id: Date.now().toString(),
        name: newMedicineName.trim(),
        times: validTimes,
      };
      const updatedMeds = [...medicines, newMedicine];
      setMedicines(updatedMeds);
      localStorage.setItem('enablex_medicines', JSON.stringify(updatedMeds));
      setNewMedicineName("");
      setNewMedicineTimes([""]);
    }
  };

  const deleteMedicine = (id: string) => {
    const updatedMeds = medicines.filter(m => m.id !== id);
    setMedicines(updatedMeds);
    localStorage.setItem('enablex_medicines', JSON.stringify(updatedMeds));
  };

  const editMedicine = (medicine: Medicine) => {
    setEditingId(medicine.id);
    setNewMedicineName(medicine.name);
    setNewMedicineTimes(medicine.times);
    deleteMedicine(medicine.id);
  };

  const playAlertSound = () => {
    // Play notification sound
    notificationSound.play();
    
    // Also vibrate if supported
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
  };

  const stopAlertSound = () => {
    notificationSound.stop();
  };

  const simulateAlert = () => {
    if (medicines.length > 0) {
      const randomMedicine = medicines[Math.floor(Math.random() * medicines.length)];
      const randomTime = randomMedicine.times[Math.floor(Math.random() * randomMedicine.times.length)];
      setAlertData({
        medicineName: randomMedicine.name,
        time: randomTime,
      });
      setShowAlert(true);
      playAlertSound();
    }
  };

  const handleTaken = () => {
    stopAlertSound();
    if (alertData) {
      // Log activity
      const log = JSON.parse(localStorage.getItem('enablex_activity_log') || '[]');
      log.unshift({
        id: Date.now().toString(),
        type: 'medication',
        title: alertData.medicineName,
        timestamp: new Date().toISOString(),
        status: 'completed'
      });
      localStorage.setItem('enablex_activity_log', JSON.stringify(log.slice(0, 100)));
    }
    setShowAlert(false);
    setAlertData(null);
  };

  const handleSnooze = () => {
    stopAlertSound();
    setShowAlert(false);
    setTimeout(() => {
      setShowAlert(true);
      playAlertSound();
    }, 5000); // Snooze for 5 seconds (demo)
  };

  // Cleanup sound on unmount
  useEffect(() => {
    return () => {
      stopAlertSound();
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
          <header className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 px-6 pt-12 pb-8 text-white shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-white drop-shadow-lg" style={{ fontSize: '2.3rem', fontWeight: 800, fontFamily: 'Times New Roman, serif' }}>
                  Medication
                </h1>
                <p className="text-white/95 mt-2 drop-shadow-md" style={{ fontSize: '1.3rem', fontWeight: 700, fontFamily: 'Times New Roman, serif' }}>
                  Manage your medicines
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
              <div className="space-y-6 pb-4">
                {/* Add Medicine Section */}
                <div className="bg-blue-50 border-3 border-blue-200 rounded-2xl p-6 shadow-lg">
                  <h2 className="text-blue-900 mb-5" style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'Times New Roman, serif' }}>Add Medicine</h2>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="text-blue-800 mb-3 block" style={{ fontSize: '1.3rem', fontWeight: 700, fontFamily: 'Times New Roman, serif' }}>Medicine Name</label>
                      <Input
                        value={newMedicineName}
                        onChange={(e) => setNewMedicineName(e.target.value)}
                        placeholder="Enter medicine name"
                        className="h-16 rounded-xl border-3 border-blue-300 focus:border-blue-500 shadow-md"
                        style={{ fontSize: '1.25rem', fontWeight: 600, fontFamily: 'Times New Roman, serif' }}
                      />
                    </div>

                    <div>
                      <label className="text-blue-800 mb-3 block" style={{ fontSize: '1.3rem', fontWeight: 700, fontFamily: 'Times New Roman, serif' }}>Daily Times</label>
                      <div className="space-y-3">
                        {newMedicineTimes.map((time, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              type="time"
                              value={time}
                              onChange={(e) => updateTimeSlot(index, e.target.value)}
                              className="h-14 text-lg rounded-xl border-2 border-blue-300 focus:border-blue-500"
                            />
                            {newMedicineTimes.length > 1 && (
                              <Button
                                onClick={() => removeTimeSlot(index)}
                                variant="ghost"
                                className="h-14 px-4 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-6 h-6" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <Button
                        onClick={addTimeSlot}
                        className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl h-16 shadow-lg hover:scale-105 transition-transform"
                        style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'Times New Roman, serif' }}
                      >
                        <Plus className="w-7 h-7 mr-2" strokeWidth={3} />
                        Add Time
                      </Button>
                      <Button
                        onClick={saveMedicine}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl h-16 shadow-lg hover:scale-105 transition-transform"
                        style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'Times New Roman, serif' }}
                      >
                        <Check className="w-7 h-7 mr-2" strokeWidth={3} />
                        Save
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Medicine List */}
                <div>
                  <h2 className="text-neutral-700 mb-5" style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'Times New Roman, serif' }}>Your Medicines</h2>
                  
                  {medicines.length === 0 ? (
                    <div className="text-center py-10 text-neutral-400">
                      <Bell className="w-20 h-20 mx-auto mb-5 opacity-30" strokeWidth={2} />
                      <p style={{ fontSize: '1.3rem', fontWeight: 600, fontFamily: 'Times New Roman, serif' }}>No medicines added yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {medicines.map((medicine) => (
                        <div
                          key={medicine.id}
                          className="bg-white border-2 border-blue-200 rounded-2xl p-5"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-blue-900 flex-1">{medicine.name}</h3>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => editMedicine(medicine)}
                                variant="ghost"
                                className="h-10 w-10 p-0 text-blue-600 hover:bg-blue-50"
                              >
                                <Edit2 className="w-5 h-5" />
                              </Button>
                              <Button
                                onClick={() => deleteMedicine(medicine.id)}
                                variant="ghost"
                                className="h-10 w-10 p-0 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-5 h-5" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {medicine.times.map((time, index) => (
                              <div
                                key={index}
                                className="bg-blue-100 text-blue-800 px-4 py-2 rounded-xl flex items-center gap-2"
                              >
                                <Clock className="w-4 h-4" />
                                <span className="text-lg">{time}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>

          {/* Footer */}
          <div className="bg-white border-t-4 border-blue-200 px-6 py-6 shadow-2xl">
            <Button
              onClick={simulateAlert}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl py-7 mb-4 shadow-xl hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:scale-100"
              disabled={medicines.length === 0}
              style={{ fontSize: '1.1rem', fontWeight: 700 }}
            >
              <Bell className="w-7 h-7 mr-2" strokeWidth={3} />
              Test Alert
            </Button>
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

      {/* Medicine Alert Popup */}
      {showAlert && alertData && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in zoom-in duration-500">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative w-full max-w-md bg-gradient-to-br from-red-500 via-red-600 to-rose-600 rounded-[3rem] shadow-2xl p-12 text-white text-center border-8 border-white/30 animate-pulse-slow">
            <div className="mb-8">
              <div className="relative inline-block">
                <Bell className="w-32 h-32 mx-auto animate-bounce text-white drop-shadow-2xl" strokeWidth={3} />
                <Volume2 className="w-12 h-12 absolute -top-2 -right-2 text-yellow-300 animate-pulse" strokeWidth={3} />
              </div>
            </div>
            <h1 className="text-white mb-6 drop-shadow-lg" style={{ fontSize: '2.5rem', fontWeight: 800 }}>
              💊 Medicine Time!
            </h1>
            <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 mb-8 border-4 border-white/30">
              <p className="text-white mb-3" style={{ fontSize: '2rem', fontWeight: 700 }}>
                {alertData.medicineName}
              </p>
              <p className="text-white/90 flex items-center justify-center gap-3" style={{ fontSize: '1.75rem' }}>
                <Clock className="w-10 h-10 animate-pulse" strokeWidth={3} />
                {alertData.time}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={handleTaken}
                className="bg-white hover:bg-green-50 text-green-600 rounded-2xl py-12 shadow-2xl hover:scale-105 transition-transform duration-200 border-4 border-green-600"
                style={{ fontSize: '1.5rem', fontWeight: 700 }}
              >
                <Check className="w-12 h-12 mr-3" strokeWidth={3.5} />
                Taken
              </Button>
              <Button
                onClick={handleSnooze}
                className="bg-white/20 hover:bg-white/30 text-white border-4 border-white rounded-2xl py-12 shadow-2xl hover:scale-105 transition-transform duration-200"
                style={{ fontSize: '1.5rem', fontWeight: 700 }}
              >
                <Clock className="w-12 h-12 mr-3" strokeWidth={3.5} />
                Snooze
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
