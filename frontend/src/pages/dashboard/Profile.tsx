import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Pencil,
  Check,
  X,
  Camera,
  Leaf,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  location: string;
  farmType: string;
  bio: string;
  avatar: string | null;
}

const DEFAULT_PROFILE: ProfileData = {
  name: "User",
  email: "user@example.com",
  phone: "",
  location: "",
  farmType: "",
  bio: "",
  avatar: null,
};

export default function Profile() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [draft, setDraft] = useState<ProfileData>(DEFAULT_PROFILE);
  const [isEditing, setIsEditing] = useState(false);

  // Load profile: merge saved profile extras with the logged-in user's name/email
  useEffect(() => {
    let loaded = { ...DEFAULT_PROFILE };
    try {
      const storedProfile = localStorage.getItem("profile");
      if (storedProfile) {
        loaded = { ...loaded, ...JSON.parse(storedProfile) };
      }
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const u = JSON.parse(storedUser);
        if (u?.name) loaded.name = u.name;
        if (u?.email) loaded.email = u.email;
      }
    } catch {
      // ignore malformed localStorage data
    }
    setProfile(loaded);
    setDraft(loaded);
  }, []);

  const handleChange = (field: keyof ProfileData, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setDraft((prev) => ({ ...prev, avatar: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setProfile(draft);
    localStorage.setItem("profile", JSON.stringify(draft));

    // Keep the header/user menu in sync (it reads name/email from "user")
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...storedUser, name: draft.name, email: draft.email })
      );
    } catch {
      localStorage.setItem(
        "user",
        JSON.stringify({ name: draft.name, email: draft.email })
      );
    }

    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your changes have been saved.",
    });
  };

  const handleCancel = () => {
    setDraft(profile);
    setIsEditing(false);
  };

  const initial = (profile.name || "U").charAt(0).toUpperCase();

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-agri-800">My Profile</h1>
        <p className="text-gray-600 mt-1">
          Manage your personal information and farming details.
        </p>
      </div>

      <Card className="border-agri-100 shadow-sm overflow-hidden">
        {/* Cover / Header */}
        <div className="h-28 bg-gradient-to-r from-agri-400 to-agri-600 relative">
          <div className="absolute -bottom-10 left-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-white bg-agri-100 flex items-center justify-center overflow-hidden shadow-md">
                {draft.avatar ? (
                  <img
                    src={draft.avatar}
                    alt="Profile avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-agri-600">{initial}</span>
                )}
              </div>
              {isEditing && (
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-agri-600 hover:bg-agri-700 text-white flex items-center justify-center cursor-pointer shadow-md"
                >
                  <Camera className="h-4 w-4" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        <CardHeader className="pt-12 pb-2 flex flex-row items-start justify-between">
          <div>
            <CardTitle className="text-xl text-agri-800">
              {isEditing ? draft.name || "Unnamed" : profile.name}
            </CardTitle>
            <p className="text-sm text-gray-500">{profile.email}</p>
          </div>
          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-agri-200 text-agri-700 hover:bg-agri-50"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                size="sm"
                className="gap-1.5 bg-agri-600 hover:bg-agri-700"
                onClick={handleSave}
              >
                <Check className="h-3.5 w-3.5" />
                Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={handleCancel}
              >
                <X className="h-3.5 w-3.5" />
                Cancel
              </Button>
            </div>
          )}
        </CardHeader>

        <CardContent className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-gray-600">
                <User className="h-3.5 w-3.5" /> Full Name
              </Label>
              {isEditing ? (
                <Input
                  value={draft.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Your full name"
                />
              ) : (
                <p className="text-gray-800 font-medium">{profile.name || "—"}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-gray-600">
                <Mail className="h-3.5 w-3.5" /> Email
              </Label>
              {isEditing ? (
                <Input
                  type="email"
                  value={draft.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="you@example.com"
                />
              ) : (
                <p className="text-gray-800 font-medium">{profile.email || "—"}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-gray-600">
                <Phone className="h-3.5 w-3.5" /> Phone Number
              </Label>
              {isEditing ? (
                <Input
                  value={draft.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="Your phone number"
                />
              ) : (
                <p className="text-gray-800 font-medium">{profile.phone || "—"}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-gray-600">
                <MapPin className="h-3.5 w-3.5" /> Location
              </Label>
              {isEditing ? (
                <Input
                  value={draft.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  placeholder="City, State"
                />
              ) : (
                <p className="text-gray-800 font-medium">{profile.location || "—"}</p>
              )}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label className="flex items-center gap-1.5 text-gray-600">
                <Leaf className="h-3.5 w-3.5" /> Farm Type / Main Crop
              </Label>
              {isEditing ? (
                <Input
                  value={draft.farmType}
                  onChange={(e) => handleChange("farmType", e.target.value)}
                  placeholder="e.g. Rice, Wheat, Mixed farming"
                />
              ) : (
                <p className="text-gray-800 font-medium">{profile.farmType || "—"}</p>
              )}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-gray-600">About</Label>
              {isEditing ? (
                <textarea
                  value={draft.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  placeholder="Tell us a bit about your farm..."
                  rows={3}
                  className="form-input w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-agri-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-700">{profile.bio || "No bio added yet."}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
