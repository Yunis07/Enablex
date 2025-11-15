import { useState, useEffect } from "react";
import { ActionCard } from "./components/ActionCard";
import { AssistiveModesPortal } from "./components/AssistiveModesPortal";
import { HearingAssistMode } from "./components/HearingAssistMode";
import { EnableXMaps } from "./components/EnableXMaps";
import { CameraGuide } from "./components/CameraGuide";
import { MedicationReminder } from "./components/MedicationReminder";
import { DailyTasks } from "./components/DailyTasks";
import { EmergencySOS } from "./components/EmergencySOS";
import { CaregiverManagement } from "./components/CaregiverManagement";
import { ActivityTracking } from "./components/ActivityTracking";
import { Settings as SettingsComponent } from "./components/Settings";
import { Toaster } from "./components/ui/sonner";
import {
  Pill,
  AlertCircle,
  CheckSquare,
  Settings2,
  Home,
  Activity,
  Users,
  Settings,
  Bell,
  User,
} from "lucide-react";
import { Button } from "./components/ui/button";
import { Avatar, AvatarFallback } from "./components/ui/avatar";
import { Badge } from "./components/ui/badge";
import {
  LanguageProvider,
  useLanguage,
} from "./contexts/LanguageContext";

interface Medicine {
  id: string;
  name: string;
  times: string[];
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

function AppContent() {
  const { t } = useLanguage();
  const [isAssistiveModesOpen, setIsAssistiveModesOpen] =
    useState(false);
  const [isHearingAssistOpen, setIsHearingAssistOpen] =
    useState(false);
  const [isMapsOpen, setIsMapsOpen] = useState(false);
  const [isCameraGuideOpen, setIsCameraGuideOpen] =
    useState(false);
  const [isMedicationOpen, setIsMedicationOpen] =
    useState(false);
  const [isDailyTasksOpen, setIsDailyTasksOpen] =
    useState(false);
  const [isEmergencySOSOpen, setIsEmergencySOSOpen] =
    useState(false);
  const [isCaregiverOpen, setIsCaregiverOpen] = useState(false);
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [upcomingMeds, setUpcomingMeds] = useState<
    Array<{ name: string; time: string }>
  >([]);
  const [upcomingTasks, setUpcomingTasks] = useState<
    Array<{ title: string }>
  >([]);
  const [userName, setUserName] = useState("Margaret");

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? t("goodMorning")
      : currentHour < 18
        ? t("goodAfternoon")
        : t("goodEvening");

  // Load user name from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem("enablex_user_name");
    if (savedName) {
      setUserName(savedName);
    }
  }, [isSettingsOpen]); // Reload when settings close

  // Load upcoming medications and tasks
  useEffect(() => {
    const loadUpcoming = () => {
      // Get medicines
      const savedMeds = localStorage.getItem(
        "enablex_medicines",
      );
      if (savedMeds) {
        const medicines: Medicine[] = JSON.parse(savedMeds);
        const now = new Date();
        const currentTime =
          now.getHours() * 60 + now.getMinutes();

        const upcoming: Array<{ name: string; time: string }> =
          [];
        medicines.forEach((med) => {
          med.times.forEach((time) => {
            const [hours, minutes] = time
              .split(":")
              .map(Number);
            const medTime = hours * 60 + minutes;
            if (medTime >= currentTime) {
              upcoming.push({ name: med.name, time });
            }
          });
        });

        upcoming.sort((a, b) => {
          const [aH, aM] = a.time.split(":").map(Number);
          const [bH, bM] = b.time.split(":").map(Number);
          return aH * 60 + aM - (bH * 60 + bM);
        });

        setUpcomingMeds(upcoming.slice(0, 2));
      }

      // Get tasks
      const savedTasks = localStorage.getItem("enablex_tasks");
      if (savedTasks) {
        const tasks: Task[] = JSON.parse(savedTasks);
        const pending = tasks
          .filter((t) => !t.completed)
          .slice(0, 2);
        setUpcomingTasks(pending);
      }
    };

    loadUpcoming();
    const interval = setInterval(loadUpcoming, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [isMedicationOpen, isDailyTasksOpen]);

  const handleAssistiveModeSelect = (mode: string) => {
    setIsAssistiveModesOpen(false);
    if (mode === "Hearing Assist") {
      setIsHearingAssistOpen(true);
    } else if (mode === "EnableX Maps") {
      setIsMapsOpen(true);
    } else if (mode === "Camera Guide") {
      setIsCameraGuideOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center p-4">
      {/* Mobile App Container */}
      <div
        className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
        style={{ height: "844px" }}
      >
        {/* Header Section */}
        <header className="bg-gradient-to-r from-orange-500 via-orange-600 to-rose-500 px-6 pt-12 pb-8 text-white shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <p
                className="text-white/95 mb-2 drop-shadow-md"
                style={{ fontSize: "1.3rem", fontWeight: 700 }}
              >
                {t("hello")}, {userName}
              </p>
              <h1
                className="text-white drop-shadow-lg"
                style={{ fontSize: "2rem", fontWeight: 800 }}
              >
                {greeting}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full bg-white/20 hover:bg-white/30 text-white relative w-14 h-14 shadow-lg backdrop-blur-sm hover:scale-110 transition-transform duration-200"
              >
                <Bell className="w-7 h-7" strokeWidth={2.5} />
                <Badge
                  className="absolute -top-1 -right-1 w-6 h-6 p-0 flex items-center justify-center bg-red-500 border-3 border-white animate-bounce"
                  style={{ fontWeight: 800 }}
                >
                  2
                </Badge>
              </Button>
              <Avatar className="w-14 h-14 border-3 border-white shadow-xl hover:scale-110 transition-transform duration-200">
                <AvatarFallback className="bg-white text-orange-600">
                  <User className="w-7 h-7" strokeWidth={2.5} />
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Quick Status */}
          <div className="bg-white/25 backdrop-blur-md rounded-2xl px-5 py-4 flex items-center justify-between shadow-lg border-2 border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg" />
              <span
                className="text-white/95 drop-shadow-md"
                style={{ fontSize: "1.15rem", fontWeight: 700 }}
              >
                {t("allSystemsNormal")}
              </span>
            </div>
            <span
              className="text-white/80 drop-shadow-md"
              style={{ fontSize: "1.1rem", fontWeight: 700 }}
            >
              {t("today")}
            </span>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-6 py-6 scroll-smooth">
          <div className="space-y-6">
            {/* Grid of Action Cards */}
            <div className="grid grid-cols-2 gap-5">
              <ActionCard
                icon={Pill}
                title={t("medicationReminder")}
                bgColor="bg-gradient-to-br from-blue-400 to-blue-500"
                iconColor="text-white"
                onClick={() => setIsMedicationOpen(true)}
              />

              <ActionCard
                icon={AlertCircle}
                title={t("emergencySOS")}
                bgColor="bg-gradient-to-br from-red-500 to-rose-600"
                iconColor="text-white"
                onClick={() => setIsEmergencySOSOpen(true)}
              />

              <ActionCard
                icon={CheckSquare}
                title={t("dailyTasks")}
                bgColor="bg-gradient-to-br from-emerald-400 to-green-500"
                iconColor="text-white"
                onClick={() => setIsDailyTasksOpen(true)}
              />

              <ActionCard
                icon={Settings2}
                title={t("assistiveModes")}
                bgColor="bg-gradient-to-br from-purple-400 to-purple-500"
                iconColor="text-white"
                onClick={() => setIsAssistiveModesOpen(true)}
              />
            </div>

            {/* Today's Overview */}
            <div className="mt-8">
              <h2
                className="text-neutral-700 mb-5 drop-shadow-sm"
                style={{ fontSize: "1.8rem", fontWeight: 800 }}
              >
                {t("upcoming")}
              </h2>

              <div className="space-y-4">
                {upcomingMeds.length === 0 &&
                upcomingTasks.length === 0 ? (
                  <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 border-3 border-neutral-200 rounded-2xl p-8 text-center shadow-md">
                    <p
                      className="text-neutral-600"
                      style={{
                        fontSize: "1.4rem",
                        fontWeight: 700,
                      }}
                    >
                      {t("noUpcomingItems")}
                    </p>
                    <p
                      className="text-neutral-500 mt-2"
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: 600,
                      }}
                    >
                      {t("allCaughtUp")}
                    </p>
                  </div>
                ) : (
                  <>
                    {upcomingMeds.map((med, index) => (
                      <div
                        key={`med-${index}`}
                        className="bg-white border-3 border-blue-200 rounded-2xl p-5 flex items-center gap-4 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 animate-in slide-in-from-bottom"
                        style={{
                          animationDelay: `${index * 100}ms`,
                        }}
                      >
                        <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-4 shadow-md">
                          <Pill
                            className="w-8 h-8 text-blue-600"
                            strokeWidth={2.5}
                          />
                        </div>
                        <div className="flex-1">
                          <p
                            className="text-neutral-800"
                            style={{
                              fontSize: "1.15rem",
                              fontWeight: 700,
                            }}
                          >
                            {med.name}
                          </p>
                          <p
                            className="text-neutral-600 mt-1"
                            style={{
                              fontSize: "1.05rem",
                              fontWeight: 600,
                            }}
                          >
                            {med.time}
                          </p>
                        </div>
                        <Badge
                          className="bg-blue-100 text-blue-700 hover:bg-blue-100 px-4 py-2 shadow-sm"
                          style={{
                            fontSize: "1.05rem",
                            fontWeight: 800,
                          }}
                        >
                          {t("upcomingLabel")}
                        </Badge>
                      </div>
                    ))}

                    {upcomingTasks.map((task, index) => (
                      <div
                        key={`task-${index}`}
                        className="bg-white border-3 border-emerald-200 rounded-2xl p-5 flex items-center gap-4 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 animate-in slide-in-from-bottom"
                        style={{
                          animationDelay: `${(upcomingMeds.length + index) * 100}ms`,
                        }}
                      >
                        <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl p-4 shadow-md">
                          <CheckSquare
                            className="w-8 h-8 text-emerald-600"
                            strokeWidth={2.5}
                          />
                        </div>
                        <div className="flex-1">
                          <p
                            className="text-neutral-800"
                            style={{
                              fontSize: "1.15rem",
                              fontWeight: 700,
                            }}
                          >
                            {task.title}
                          </p>
                          <p
                            className="text-neutral-600 mt-1"
                            style={{
                              fontSize: "1.05rem",
                              fontWeight: 600,
                            }}
                          >
                            To Do
                          </p>
                        </div>
                        <Badge
                          className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 px-4 py-2 shadow-sm"
                          style={{
                            fontSize: "1.05rem",
                            fontWeight: 800,
                          }}
                        >
                          {t("pending")}
                        </Badge>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Bottom Navigation */}
        <nav className="bg-white border-t-4 border-neutral-100 px-4 py-5 shadow-2xl">
          <div className="flex items-center justify-around">
            <Button
              variant="ghost"
              className="flex flex-col items-center gap-2 h-auto py-3 px-6 bg-gradient-to-br from-orange-100 to-orange-200 text-orange-600 hover:bg-orange-200 hover:text-orange-700 rounded-2xl shadow-md hover:scale-110 transition-all duration-200"
            >
              <Home className="w-8 h-8" strokeWidth={3} />
              <span
                className="text-xs"
                style={{ fontWeight: 800 }}
              >
                {t("home")}
              </span>
            </Button>

            <Button
              variant="ghost"
              className="flex flex-col items-center gap-2 h-auto py-3 px-6 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 rounded-2xl hover:scale-110 transition-all duration-200"
              onClick={() => setIsActivityOpen(true)}
            >
              <Activity className="w-8 h-8" strokeWidth={3} />
              <span
                className="text-xs"
                style={{ fontWeight: 800 }}
              >
                {t("activity")}
              </span>
            </Button>

            <Button
              variant="ghost"
              className="flex flex-col items-center gap-2 h-auto py-3 px-6 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 rounded-2xl hover:scale-110 transition-all duration-200"
              onClick={() => setIsCaregiverOpen(true)}
            >
              <Users className="w-8 h-8" strokeWidth={3} />
              <span
                className="text-xs"
                style={{ fontWeight: 800 }}
              >
                {t("caregiver")}
              </span>
            </Button>

            <Button
              variant="ghost"
              className="flex flex-col items-center gap-2 h-auto py-3 px-6 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 rounded-2xl hover:scale-110 transition-all duration-200"
              onClick={() => setIsSettingsOpen(true)}
            >
              <Settings className="w-8 h-8" strokeWidth={3} />
              <span
                className="text-xs"
                style={{ fontWeight: 800 }}
              >
                {t("settings")}
              </span>
            </Button>
          </div>
        </nav>
      </div>

      {/* Assistive Modes Portal */}
      <AssistiveModesPortal
        isOpen={isAssistiveModesOpen}
        onClose={() => setIsAssistiveModesOpen(false)}
        onSelectMode={handleAssistiveModeSelect}
      />

      {/* Hearing Assist Mode */}
      <HearingAssistMode
        isOpen={isHearingAssistOpen}
        onClose={() => setIsHearingAssistOpen(false)}
      />

      {/* EnableX Maps */}
      <EnableXMaps
        isOpen={isMapsOpen}
        onClose={() => setIsMapsOpen(false)}
      />

      {/* Camera Guide */}
      <CameraGuide
        isOpen={isCameraGuideOpen}
        onClose={() => setIsCameraGuideOpen(false)}
      />

      {/* Medication Reminder */}
      <MedicationReminder
        isOpen={isMedicationOpen}
        onClose={() => setIsMedicationOpen(false)}
      />

      {/* Daily Tasks */}
      <DailyTasks
        isOpen={isDailyTasksOpen}
        onClose={() => setIsDailyTasksOpen(false)}
      />

      {/* Emergency SOS */}
      <EmergencySOS
        isOpen={isEmergencySOSOpen}
        onClose={() => setIsEmergencySOSOpen(false)}
      />

      {/* Caregiver Management */}
      <CaregiverManagement
        isOpen={isCaregiverOpen}
        onClose={() => setIsCaregiverOpen(false)}
      />

      {/* Activity Tracking */}
      <ActivityTracking
        isOpen={isActivityOpen}
        onClose={() => setIsActivityOpen(false)}
      />

      {/* Settings */}
      <SettingsComponent
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Toast Notifications */}
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}