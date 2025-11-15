import { useState, useEffect } from "react";
import { X, Plus, Trash2, Edit2, Phone, UserPlus, Users, Stethoscope } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface CaregiverManagementProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Caregiver {
  id: string;
  name: string;
  phone: string;
  type: 'family' | 'doctor';
}

export function CaregiverManagement({ isOpen, onClose }: CaregiverManagementProps) {
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newType, setNewType] = useState<'family' | 'doctor'>('family');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Load caregivers from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('enablex_caregivers');
    if (saved) {
      setCaregivers(JSON.parse(saved));
    }
  }, []);

  // Save caregivers to localStorage
  useEffect(() => {
    localStorage.setItem('enablex_caregivers', JSON.stringify(caregivers));
  }, [caregivers]);

  const addCaregiver = () => {
    if (newName.trim() && newPhone.trim()) {
      const newCaregiver: Caregiver = {
        id: Date.now().toString(),
        name: newName.trim(),
        phone: newPhone.trim(),
        type: newType,
      };
      setCaregivers([...caregivers, newCaregiver]);
      setNewName("");
      setNewPhone("");
      setNewType('family');
      setShowAddModal(false);
    }
  };

  const deleteCaregiver = (id: string) => {
    setCaregivers(caregivers.filter(c => c.id !== id));
  };

  const editCaregiver = (caregiver: Caregiver) => {
    setEditingId(caregiver.id);
    setNewName(caregiver.name);
    setNewPhone(caregiver.phone);
    setNewType(caregiver.type);
    deleteCaregiver(caregiver.id);
    setShowAddModal(true);
  };

  const familyCaregivers = caregivers.filter(c => c.type === 'family');
  const doctorCaregivers = caregivers.filter(c => c.type === 'doctor');

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
          <header className="bg-gradient-to-r from-rose-500 to-red-600 px-6 pt-12 pb-8 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-white">Caregivers</h1>
                <p className="text-white/90 mt-1">{caregivers.length} contacts</p>
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

          {/* Main Content */}
          <main className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="space-y-6 pb-4">
                {/* Family Section - Priority */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-6 h-6 text-rose-600" />
                    <h2 className="text-neutral-800">Family (Priority)</h2>
                  </div>
                  
                  {familyCaregivers.length === 0 ? (
                    <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-6 text-center">
                      <Users className="w-12 h-12 mx-auto mb-3 text-rose-400 opacity-50" />
                      <p className="text-rose-800">No family contacts added</p>
                      <p className="text-rose-600 text-sm mt-1">Family contacts get priority alerts</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {familyCaregivers.map((caregiver) => (
                        <div
                          key={caregiver.id}
                          className="bg-white border-2 border-rose-200 rounded-2xl p-5"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="text-neutral-800 mb-1">{caregiver.name}</h3>
                              <div className="flex items-center gap-2 text-neutral-600">
                                <Phone className="w-4 h-4" />
                                <span className="text-lg">{caregiver.phone}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => editCaregiver(caregiver)}
                                variant="ghost"
                                className="h-10 w-10 p-0 text-blue-600 hover:bg-blue-50"
                              >
                                <Edit2 className="w-5 h-5" />
                              </Button>
                              <Button
                                onClick={() => deleteCaregiver(caregiver.id)}
                                variant="ghost"
                                className="h-10 w-10 p-0 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-5 h-5" />
                              </Button>
                            </div>
                          </div>
                          <div className="bg-rose-100 text-rose-800 px-3 py-1 rounded-lg text-sm inline-block">
                            Priority Alert
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Doctor Section */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Stethoscope className="w-6 h-6 text-blue-600" />
                    <h2 className="text-neutral-800">Doctors</h2>
                  </div>
                  
                  {doctorCaregivers.length === 0 ? (
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 text-center">
                      <Stethoscope className="w-12 h-12 mx-auto mb-3 text-blue-400 opacity-50" />
                      <p className="text-blue-800">No doctor contacts added</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {doctorCaregivers.map((caregiver) => (
                        <div
                          key={caregiver.id}
                          className="bg-white border-2 border-blue-200 rounded-2xl p-5"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-neutral-800 mb-1">{caregiver.name}</h3>
                              <div className="flex items-center gap-2 text-neutral-600">
                                <Phone className="w-4 h-4" />
                                <span className="text-lg">{caregiver.phone}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => editCaregiver(caregiver)}
                                variant="ghost"
                                className="h-10 w-10 p-0 text-blue-600 hover:bg-blue-50"
                              >
                                <Edit2 className="w-5 h-5" />
                              </Button>
                              <Button
                                onClick={() => deleteCaregiver(caregiver.id)}
                                variant="ghost"
                                className="h-10 w-10 p-0 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-5 h-5" />
                              </Button>
                            </div>
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
          <div className="bg-white border-t-2 border-neutral-100 px-6 py-6">
            <Button
              onClick={() => setShowAddModal(true)}
              className="w-full bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white rounded-2xl py-6 mb-3 shadow-md"
            >
              <Plus className="w-6 h-6 mr-2" strokeWidth={2.5} />
              Add Contact
            </Button>
            <Button 
              onClick={onClose}
              className="w-full bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-2xl py-6 shadow-md"
            >
              Back
            </Button>
          </div>
        </div>
      </div>

      {/* Add Caregiver Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/70"
            onClick={() => {
              setShowAddModal(false);
              setEditingId(null);
              setNewName("");
              setNewPhone("");
              setNewType('family');
            }}
          />
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl">
            <h2 className="text-neutral-800 mb-6 text-center">Add Caregiver Number</h2>
            
            <div className="space-y-4">
              <div>
                <Label className="text-neutral-700 mb-2 block text-lg">Name</Label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Enter name"
                  className="h-14 text-lg rounded-xl border-2"
                />
              </div>

              <div>
                <Label className="text-neutral-700 mb-2 block text-lg">Phone Number</Label>
                <Input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="Enter phone number"
                  className="h-14 text-lg rounded-xl border-2"
                />
              </div>

              <div>
                <Label className="text-neutral-700 mb-2 block text-lg">Contact Type</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    onClick={() => setNewType('family')}
                    className={`h-14 rounded-xl ${
                      newType === 'family'
                        ? 'bg-rose-500 hover:bg-rose-600 text-white'
                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    <Users className="w-5 h-5 mr-2" />
                    Family
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setNewType('doctor')}
                    className={`h-14 rounded-xl ${
                      newType === 'doctor'
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    <Stethoscope className="w-5 h-5 mr-2" />
                    Doctor
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <Button
                onClick={addCaregiver}
                className="bg-green-500 hover:bg-green-600 text-white rounded-xl py-6 text-lg"
              >
                Add
              </Button>
              <Button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingId(null);
                  setNewName("");
                  setNewPhone("");
                  setNewType('family');
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-6 text-lg"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
