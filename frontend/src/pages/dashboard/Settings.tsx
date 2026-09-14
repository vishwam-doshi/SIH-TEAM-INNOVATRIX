import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Moon,
  Sun,
  Bell,
  Mail,
  Ruler,
  Globe,
  LogOut,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface AppSettings {
  theme: "light" | "dark";
  emailAlerts: boolean;
  pushAlerts: boolean;
  weatherAlerts: boolean;
  units: "metric" | "imperial";
  language: string;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: "light",
  emailAlerts: true,
  pushAlerts: true,
  weatherAlerts: true,
  units: "metric",
  language: "en",
};

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिन्दी (Hindi)" },
  { code: "bn", name: "বাংলা (Bengali)" },
  { code: "te", name: "తెలుగు (Telugu)" },
  { code: "ta", name: "தமிழ் (Tamil)" },
  { code: "mr", name: "मराठी (Marathi)" },
];

const SETTINGS_KEY = "appSettings";

export default function Settings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [user, setUser] = useState({ name: "User", email: "user@example.com" });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const parsed = { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
        setSettings(parsed);
        applyTheme(parsed.theme);
      }
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch {
      // ignore malformed localStorage data
    }
  }, []);

  const applyTheme = (theme: "light" | "dark") => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  };

  const persist = (next: AppSettings) => {
    setSettings(next);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  };

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    const next = { ...settings, [key]: value };
    if (key === "theme") applyTheme(value as AppSettings["theme"]);
    persist(next);
    toast({ title: "Settings saved" });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-agri-800">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your preferences and account options.
        </p>
      </div>

      {/* Account */}
      <Card className="border-agri-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-agri-800">
            <User className="h-4.5 w-4.5 text-agri-600" /> Account
          </CardTitle>
          <CardDescription>Your signed-in account details.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="font-medium text-gray-800">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-agri-200 text-agri-700 hover:bg-agri-50"
              onClick={() => navigate("/dashboard/profile")}
            >
              Edit Profile
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-red-200 text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="border-agri-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-agri-800">
            {settings.theme === "dark" ? (
              <Moon className="h-4.5 w-4.5 text-agri-600" />
            ) : (
              <Sun className="h-4.5 w-4.5 text-agri-600" />
            )}
            Appearance
          </CardTitle>
          <CardDescription>Choose how AgriSmart looks on your device.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800">Dark Mode</p>
            <p className="text-sm text-gray-500">Switch between light and dark themes.</p>
          </div>
          <Switch
            checked={settings.theme === "dark"}
            onCheckedChange={(checked) => updateSetting("theme", checked ? "dark" : "light")}
          />
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border-agri-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-agri-800">
            <Bell className="h-4.5 w-4.5 text-agri-600" /> Notifications
          </CardTitle>
          <CardDescription>Control what you get notified about.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Push Notifications</p>
              <p className="text-sm text-gray-500">In-app alerts for predictions and results.</p>
            </div>
            <Switch
              checked={settings.pushAlerts}
              onCheckedChange={(checked) => updateSetting("pushAlerts", checked)}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> Email Alerts
              </p>
              <p className="text-sm text-gray-500">Get a summary emailed to you.</p>
            </div>
            <Switch
              checked={settings.emailAlerts}
              onCheckedChange={(checked) => updateSetting("emailAlerts", checked)}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Weather Alerts</p>
              <p className="text-sm text-gray-500">Notify me about severe weather changes.</p>
            </div>
            <Switch
              checked={settings.weatherAlerts}
              onCheckedChange={(checked) => updateSetting("weatherAlerts", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="border-agri-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-agri-800">
            <Globe className="h-4.5 w-4.5 text-agri-600" /> Preferences
          </CardTitle>
          <CardDescription>Language and measurement units.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="font-medium text-gray-800">Language</p>
              <p className="text-sm text-gray-500">Display language for the app.</p>
            </div>
            <select
              value={settings.language}
              onChange={(e) => updateSetting("language", e.target.value)}
              className="form-input rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-agri-500 focus:border-transparent"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          <Separator />
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="font-medium text-gray-800 flex items-center gap-1.5">
                <Ruler className="h-3.5 w-3.5" /> Units
              </p>
              <p className="text-sm text-gray-500">Metric (°C, mm, ha) or Imperial (°F, in, ac).</p>
            </div>
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              <button
                onClick={() => updateSetting("units", "metric")}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  settings.units === "metric"
                    ? "bg-agri-600 text-white"
                    : "bg-white text-gray-600 hover:bg-agri-50"
                }`}
              >
                Metric
              </button>
              <button
                onClick={() => updateSetting("units", "imperial")}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  settings.units === "imperial"
                    ? "bg-agri-600 text-white"
                    : "bg-white text-gray-600 hover:bg-agri-50"
                }`}
              >
                Imperial
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
