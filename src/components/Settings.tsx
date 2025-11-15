import { useState, useEffect } from "react";
import {
  X,
  User,
  Phone,
  Globe,
  MessageCircle,
  Mail,
  PhoneCall,
  Send,
  Check,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  useLanguage,
  Language,
} from "../contexts/LanguageContext";
import { toast } from "sonner@2.0.3";

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const CUSTOMER_SERVICE = {
  phones: [
    "+919363025557",
    "+919080558207",
    "+917448456832",
    "+9779846647538",
  ],
  emails: [
    "yunisnainawasti.2501269@srec.ac.in",
    "taniya.2501251@srec.ac.in",
    "sahana.2501214@srec.ac.in",
    "rithekasree.2501204@srec.ac.in",
  ],
};

export function Settings({ isOpen, onClose }: SettingsProps) {
  const { language, setLanguage, t } = useLanguage();
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [messageSending, setMessageSending] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const savedName =
        localStorage.getItem("enablex_user_name") || "";
      const savedPhone =
        localStorage.getItem("enablex_user_phone") || "";
      const savedLogin =
        localStorage.getItem("enablex_logged_in") === "true";

      setUserName(savedName);
      setPhoneNumber(savedPhone);
      setIsLoggedIn(savedLogin);
    }
  }, [isOpen]);

  const handleSaveProfile = () => {
    localStorage.setItem("enablex_user_name", userName);
    localStorage.setItem("enablex_user_phone", phoneNumber);
    toast.success(t("success"), {
      description: "Profile saved successfully!",
    });
  };

  const handleLogin = () => {
    if (userName && phoneNumber) {
      localStorage.setItem("enablex_logged_in", "true");
      setIsLoggedIn(true);
      toast.success(t("success"), {
        description: "Logged in successfully!",
      });
    } else {
      toast.error(t("error"), {
        description: "Please enter your name and phone number",
      });
    }
  };

  const handleLogout = () => {
    localStorage.setItem("enablex_logged_in", "false");
    setIsLoggedIn(false);
    toast.success(t("success"), {
      description: "Logged out successfully!",
    });
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error(t("error"), {
        description: "Please enter your message",
      });
      return;
    }

    setMessageSending(true);

    // Simulate sending to all contacts
    setTimeout(() => {
      // Open email client with all addresses
      const emailSubject = encodeURIComponent(
        "EnableX Support Request",
      );
      const emailBody = encodeURIComponent(
        `From: ${userName || "User"}\nPhone: ${phoneNumber || "N/A"}\n\nMessage:\n${message}`,
      );
      const allEmails = CUSTOMER_SERVICE.emails.join(",");
      window.location.href = `mailto:${allEmails}?subject=${emailSubject}&body=${emailBody}`;

      setMessage("");
      setMessageSending(false);
      toast.success(t("messageSent"));
    }, 1000);
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    toast.success(t("success"), {
      description: "Language changed successfully!",
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gradient-to-br from-white to-orange-50 z-50 animate-in slide-in-from-right duration-300"
      style={{ fontFamily: "Times New Roman, serif" }}
    >
      <div className="h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-rose-500 px-6 py-6 text-white relative shadow-xl flex items-center justify-between">
          <h1
            className="text-white drop-shadow-lg"
            style={{ fontSize: "2.2rem", fontWeight: 800 }}
          >
            {t("settings")}
          </h1>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 rounded-full w-16 h-16 shadow-lg backdrop-blur-sm hover:scale-110 transition-all duration-200"
            aria-label="Close settings"
          >
            <X className="w-9 h-9" strokeWidth={3} />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scroll-smooth">
          {/* User Profile Section */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border-3 border-orange-200 space-y-5 animate-in slide-in-from-bottom">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl p-4 shadow-lg">
                <User
                  className="w-8 h-8 text-white"
                  strokeWidth={3}
                />
              </div>
              <h2
                className="text-neutral-800"
                style={{ fontSize: "1.8rem", fontWeight: 800 }}
              >
                {t("userProfile")}
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  className="text-neutral-700 mb-2 block"
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: 700,
                  }}
                >
                  {t("userName")}
                </label>
                <Input
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                  className="h-14 text-neutral-800 border-3 border-neutral-300 focus:border-orange-400 rounded-xl shadow-md"
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: 600,
                    fontFamily: "Times New Roman, serif",
                  }}
                />
              </div>

              <div>
                <label
                  className="text-neutral-700 mb-2 block"
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: 700,
                  }}
                >
                  {t("phoneNumber")}
                </label>
                <Input
                  value={phoneNumber}
                  onChange={(e) =>
                    setPhoneNumber(e.target.value)
                  }
                  placeholder="Enter phone number"
                  type="tel"
                  className="h-14 text-neutral-800 border-3 border-neutral-300 focus:border-orange-400 rounded-xl shadow-md"
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: 600,
                    fontFamily: "Times New Roman, serif",
                  }}
                />
              </div>

              <div className="flex gap-3 pt-3">
                <Button
                  onClick={handleSaveProfile}
                  className="flex-1 h-14 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:scale-105 transition-transform duration-200"
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: 800,
                  }}
                >
                  {t("save")}
                </Button>

                {!isLoggedIn ? (
                  <Button
                    onClick={handleLogin}
                    className="flex-1 h-14 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl shadow-lg hover:scale-105 transition-transform duration-200"
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: 800,
                    }}
                  >
                    {t("login")}
                  </Button>
                ) : (
                  <Button
                    onClick={handleLogout}
                    className="flex-1 h-14 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl shadow-lg hover:scale-105 transition-transform duration-200"
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: 800,
                    }}
                  >
                    {t("logout")}
                  </Button>
                )}
              </div>

              {isLoggedIn && (
                <div className="bg-green-50 border-3 border-green-300 rounded-xl p-4 flex items-center gap-3 shadow-md animate-in slide-in-from-bottom">
                  <Check
                    className="w-7 h-7 text-green-600"
                    strokeWidth={3}
                  />
                  <p
                    className="text-green-800"
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: 700,
                    }}
                  >
                    Logged in as {userName}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Language Settings */}
          <div
            className="bg-white rounded-2xl p-6 shadow-lg border-3 border-purple-200 space-y-5 animate-in slide-in-from-bottom"
            style={{ animationDelay: "100ms" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl p-4 shadow-lg">
                <Globe
                  className="w-8 h-8 text-white"
                  strokeWidth={3}
                />
              </div>
              <h2
                className="text-neutral-800"
                style={{ fontSize: "1.8rem", fontWeight: 800 }}
              >
                {t("languageSettings")}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { code: "en", name: "english" },
                { code: "ta", name: "tamil" },
                { code: "ml", name: "malayalam" },
                { code: "ne", name: "nepali" },
                { code: "te", name: "telugu" },
                { code: "kn", name: "kannada" },
              ].map((lang) => (
                <Button
                  key={lang.code}
                  onClick={() =>
                    handleLanguageChange(lang.code as Language)
                  }
                  className={`h-14 rounded-xl shadow-md hover:scale-105 transition-all duration-200 ${
                    language === lang.code
                      ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                      : "bg-gradient-to-br from-neutral-100 to-neutral-200 text-neutral-800 hover:from-neutral-200 hover:to-neutral-300"
                  }`}
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: 800,
                  }}
                >
                  {t(lang.name)}
                </Button>
              ))}
            </div>
          </div>

          {/* Customer Service Section */}
          <div
            className="bg-white rounded-2xl p-6 shadow-lg border-3 border-blue-200 space-y-5 animate-in slide-in-from-bottom"
            style={{ animationDelay: "200ms" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl p-4 shadow-lg">
                <MessageCircle
                  className="w-8 h-8 text-white"
                  strokeWidth={3}
                />
              </div>
              <h2
                className="text-neutral-800"
                style={{ fontSize: "1.8rem", fontWeight: 800 }}
              >
                {t("customerService")}
              </h2>
            </div>

            {/* Contact Numbers */}
            <div className="space-y-3">
              <h3
                className="text-neutral-700"
                style={{ fontSize: "1.4rem", fontWeight: 800 }}
              >
                {t("contactNumbers")}
              </h3>
              {CUSTOMER_SERVICE.phones.map((phone, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-green-50 to-green-100 border-3 border-green-300 rounded-xl p-4 flex items-center justify-between shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <Phone
                      className="w-7 h-7 text-green-600"
                      strokeWidth={3}
                    />
                    <span
                      className="text-neutral-800"
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: 700,
                      }}
                    >
                      {phone}
                    </span>
                  </div>
                  <Button
                    onClick={() => handleCall(phone)}
                    className="h-12 px-5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg shadow-md hover:scale-110 transition-transform duration-200"
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 800,
                    }}
                  >
                    <PhoneCall
                      className="w-5 h-5 mr-2"
                      strokeWidth={3}
                    />
                    {t("call")}
                  </Button>
                </div>
              ))}
            </div>

            {/* Email Addresses */}
            <div className="space-y-3">
              <h3
                className="text-neutral-700"
                style={{ fontSize: "1.4rem", fontWeight: 800 }}
              >
                {t("emailAddresses")}
              </h3>
              {CUSTOMER_SERVICE.emails.map((email, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 border-3 border-blue-300 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Mail
                      className="w-7 h-7 text-blue-600 flex-shrink-0"
                      strokeWidth={3}
                    />
                    <span
                      className="text-neutral-800 break-all"
                      style={{
                        fontSize: "1.05rem",
                        fontWeight: 700,
                      }}
                    >
                      {email}
                    </span>
                  </div>
                  <Button
                    onClick={() => handleEmail(email)}
                    className="h-12 px-5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:scale-110 transition-transform duration-200 flex-shrink-0 w-full sm:w-auto"
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 800,
                    }}
                  >
                    <Mail
                      className="w-5 h-5 mr-2"
                      strokeWidth={3}
                    />
                    {t("email")}
                  </Button>
                </div>
              ))}
            </div>

            {/* Send Message Form */}
            <div className="space-y-3 pt-3">
              <h3
                className="text-neutral-700"
                style={{ fontSize: "1.4rem", fontWeight: 800 }}
              >
                {t("sendMessage")}
              </h3>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t("typeYourIssue")}
                className="min-h-[130px] text-neutral-800 border-3 border-neutral-300 focus:border-orange-400 rounded-xl shadow-md resize-none"
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  fontFamily: "Times New Roman, serif",
                }}
              />
              <Button
                onClick={handleSendMessage}
                disabled={messageSending}
                className="w-full h-14 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white rounded-xl shadow-lg hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:hover:scale-100"
                style={{ fontSize: "1.3rem", fontWeight: 800 }}
              >
                <Send
                  className="w-6 h-6 mr-2"
                  strokeWidth={3}
                />
                {messageSending ? t("loading") : t("submit")}
              </Button>
              <p
                className="text-neutral-600 text-center"
                style={{ fontSize: "1rem", fontWeight: 600 }}
              >
                Your message will be sent to all customer
                service contacts
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}