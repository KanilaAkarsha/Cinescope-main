"use client";

import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useEffect, useRef, useState } from "react";
import {
  Camera,
  Check,
  Edit,
  Key,
  Lock,
  Mail,
  Smartphone,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { updateProfile } from "@/services/admin.service";
import API from "@/app/config/api";

import { useDispatch, useSelector } from "react-redux";
import { login } from "@/app/app/features/authSlice";
import { uploadImage } from "@/services/upload.service";

export default function ProfilePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const avatarInputRef = useRef(null);
  const reduxUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch(); // ← add this

  const { data: session } = useSession();
  const user = reduxUser || session?.user;
  const [profile, setProfile] = useState({
    avatarUrl: "",
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    language: "en",
    timezone: "utc",
    role: "Admin",
    updatedAt: null,
  });
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isCurrentPasswordVerified, setIsCurrentPasswordVerified] =
    useState(false);
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);

  //

  const handleAvatarUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }

    // Immediate local preview
    const localPreviewUrl = URL.createObjectURL(file);
    setProfile((current) => ({ ...current, avatarUrl: localPreviewUrl }));

    const toastId = toast.loading("Uploading image...");

    try {
      const result = await uploadImage(file);

      if (!result.success) {
        throw new Error(result.message);
      }

      // ✅ store Cloudinary URL
      setProfile((current) => ({ ...current, avatarUrl: result.url }));
      toast.success("Image uploaded!", { id: toastId });

      // Automatically save profile picture to backend
      const userId = user?._id || user?.id;
      if (userId) {
        const updateResult = await updateProfile({
          id: userId,
          profilePicture: result.url,
        });

        if (updateResult.success && updateResult.data) {
          dispatch(
            login({
              token: localStorage.getItem("token"),
              user: updateResult.data,
            }),
          );
        }
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image.",
        { id: toastId },
      );
    }

    event.target.value = "";
  };

  const openAvatarPicker = () => {
    if (!isEditing) {
      return;
    }

    avatarInputRef.current?.click();
  };

  useEffect(() => {
    if (!user) return;

    const firstName = user.first_name || user.name?.split(" ")[0] || "";
    const lastName =
      user.last_name || user.name?.split(" ").slice(1).join(" ") || "";

    setProfile({
      avatarUrl: user.profilePicture || user.avatar || user.image || "",
      firstName,
      lastName,
      email: user.email || "",
      bio: user.bio || "",
      language: user.language || "en",
      timezone: user.timezone || "utc",
      role: user.role || "Admin",
      updatedAt: user.updatedAt || null,
    });
  }, [user]);

  const updateProfileField = (field) => (event) => {
    const value = event.target.value;
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updatePasswordField = (field) => (event) => {
    const value = event.target.value;
    setPassword((current) => ({
      ...current,
      [field]: value,
    }));

    if (field === "currentPassword") {
      setIsCurrentPasswordVerified(false);
    }
  };

  const handleVerifyCurrentPassword = async () => {
    if (!user?.email) {
      toast.error("No active session found.");
      return;
    }

    if (!password.currentPassword) {
      toast.error("Enter your current password first.");
      return;
    }

    setIsVerifyingPassword(true);

    try {
      await API.post("/api/users/login", {
        email: user.email,
        password: password.currentPassword,
      });
      setIsCurrentPasswordVerified(true);
      toast.success("Current password verified. You can now change it.");
    } catch (error) {
      setIsCurrentPasswordVerified(false);
      toast.error(
        error?.response?.data?.message ||
          (error instanceof Error
            ? error.message
            : "Current password is invalid"),
      );
    } finally {
      setIsVerifyingPassword(false);
    }
  };

  const formatDisplayDate = (value) => {
    if (!value) {
      return "Never";
    }

    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleString();
  };

  const handleSaveProfile = async () => {
    const userId = user?._id || user?.id;
    if (!userId) {
      toast.error("No active session found.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await updateProfile({
        id: userId,
        first_name: profile.firstName,
        last_name: profile.lastName,
        email: profile.email,
        bio: profile.bio,
        profilePicture: profile.avatarUrl,
        language: profile.language,
        timezone: profile.timezone,
      });

      if (!result?.success) {
        throw new Error(result?.message || "Failed to update profile");
      }

      // Merge returned updates into local profile state so UI reflects saved values
      if (result?.data) {
        setProfile((current) => ({
          ...current,
          avatarUrl:
            result.data.profilePicture ||
            result.data.avatar ||
            current.avatarUrl,
          firstName: result.data.first_name || current.firstName,
          lastName: result.data.last_name || current.lastName,
          email: result.data.email || current.email,
          bio: result.data.bio ?? current.bio,
          language: result.data.language || current.language,
          timezone: result.data.timezone || current.timezone,
          updatedAt: result.data.updatedAt || current.updatedAt,
        }));
        
        // Update Redux state with the returned user data
        dispatch(
          login({
            token: localStorage.getItem("token"),
            user: result.data,
          }),
        );
      }
      setIsSubmitting(false);
      setIsEditing(false);
      toast.success("Profile updated!", {
        className: "success",
        description: "Your profile has been updated successfully.",
        icon: <MyIcon />,
        cancel: {
          label: "Dismiss",
          onClick: () => console.log("Dismiss"),
        },
      });
    } catch (error) {
      setIsSubmitting(false);
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile",
      );
    }
  };

  const handleChangePassword = async () => {
    const userId = user?._id || user?.id;
    if (!userId) {
      toast.error("No active session found.");
      return;
    }

    if (!password.currentPassword || !password.newPassword) {
      toast.error("Please enter your current and new password.");
      return;
    }

    if (!isCurrentPasswordVerified) {
      toast.error("Verify your current password before changing it.");
      return;
    }

    if (password.newPassword !== password.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    setIsSubmitting(true);

    try {
      const result = await updateProfile({
        id: userId,
        current_password: password.currentPassword,
        new_password: password.newPassword,
        confirm_password: password.confirmPassword,
      });

      if (!result?.success) {
        throw new Error(result?.message || "Failed to change password");
      }

      setPassword({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsCurrentPasswordVerified(false);
      toast.success("Password changed successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to change password",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_3fr]">
        {/* Profile Sidebar */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
                <Avatar
                  className={`h-32 w-32 ${
                    isEditing ? "cursor-pointer ring-2 ring-primary/40" : ""
                  }`}
                  onClick={openAvatarPicker}
                  role="button"
                  aria-label="Upload profile picture"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openAvatarPicker();
                    }
                  }}>
                  <AvatarImage
                    src={
                      profile.avatarUrl ||
                      user?.profilePicture ||
                      user?.avatar ||
                      ""
                    }
                    key={profile.avatarUrl || user?.profilePicture || user?.avatar}
                    alt={`${profile.firstName} ${profile.lastName}`}
                  />
                  <AvatarFallback className="text-4xl">
                    {profile.firstName?.[0] || user?.first_name?.[0] || user?.name?.[0] || "U"}
                    {profile.lastName?.[0] || user?.last_name?.[0] || ""}
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                  onClick={openAvatarPicker}
                  disabled={!isEditing}>
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold">
                  {`${profile.firstName} ${profile.lastName}`.trim() ||
                    `${user?.first_name || ""} ${user?.last_name || ""}`.trim() ||
                    user?.name ||
                    "Admin User"}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {profile.email || user?.email || ""}
                </p>
              </div>
              <div className="w-full">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Done Editing
                    </>
                  ) : (
                    <>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="text-muted-foreground h-5 w-5" />
                <div>
                  <p className="text-sm font-medium">
                    {profile.role || user?.role || "Admin"}
                  </p>
                  <p className="text-muted-foreground text-xs">Role</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="text-muted-foreground h-5 w-5" />
                <div>
                  <p className="text-sm font-medium">
                    {profile.email || user?.email || "Not provided"}
                  </p>
                  <p className="text-muted-foreground text-xs">Email</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Key className="text-muted-foreground h-5 w-5" />
                <div>
                  <p className="text-sm font-medium">
                    {formatDisplayDate(profile.updatedAt || user?.updatedAt)}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Account Activity
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Content */}
        <div className="space-y-6">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="personal">Personal Information</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal information and contact details.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input
                        id="first-name"
                        value={profile.firstName}
                        onChange={updateProfileField("firstName")}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input
                        id="last-name"
                        value={profile.lastName}
                        onChange={updateProfileField("lastName")}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={updateProfileField("email")}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2"></div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      className="min-h-25"
                      value={profile.bio}
                      onChange={updateProfileField("bio")}
                      disabled={!isEditing}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isSubmitting || !isEditing}
                    className="ml-auto">
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>
                    Configure your account preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={profile.language}
                      onValueChange={(value) =>
                        setProfile((current) => ({
                          ...current,
                          language: value,
                        }))
                      }
                      disabled={!isEditing}>
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={profile.timezone}
                      onValueChange={(value) =>
                        setProfile((current) => ({
                          ...current,
                          timezone: value,
                        }))
                      }
                      disabled={!isEditing}>
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc">UTC</SelectItem>
                        <SelectItem value="est">
                          Eastern Standard Time (EST)
                        </SelectItem>
                        <SelectItem value="cst">
                          Central Standard Time (CST)
                        </SelectItem>
                        <SelectItem value="mst">
                          Mountain Standard Time (MST)
                        </SelectItem>
                        <SelectItem value="pst">
                          Pacific Standard Time (PST)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isSubmitting || !isEditing}
                    className="ml-auto">
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={password.currentPassword}
                      onChange={updatePasswordField("currentPassword")}
                    />
                    <div className="flex items-center justify-between gap-3 pt-2">
                      <p className="text-muted-foreground text-xs">
                        {isCurrentPasswordVerified
                          ? "Current password verified."
                          : "Verify your current password to unlock change access."}
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleVerifyCurrentPassword}
                        disabled={
                          isVerifyingPassword || !password.currentPassword
                        }>
                        {isVerifyingPassword ? "Verifying..." : "Verify"}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={password.newPassword}
                      onChange={updatePasswordField("newPassword")}
                      disabled={!isCurrentPasswordVerified}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={password.confirmPassword}
                      onChange={updatePasswordField("confirmPassword")}
                      disabled={!isCurrentPasswordVerified}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleChangePassword}
                    disabled={isSubmitting || !isCurrentPasswordVerified}
                    className="ml-auto">
                    {isSubmitting ? "Changing..." : "Change Password"}
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>
                    Add an extra layer of security to your account.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="two-factor">
                        Two-Factor Authentication
                      </Label>
                      <p className="text-muted-foreground text-sm">
                        Require a verification code when logging in.
                      </p>
                    </div>
                    <Switch id="two-factor" defaultChecked />
                  </div>

                  <div className="space-y-2">
                    <Label>Recovery Codes</Label>
                    <Button variant="outline" className="w-full">
                      <Lock className="mr-2 h-4 w-4" />
                      Generate Recovery Codes
                    </Button>
                    <p className="text-muted-foreground text-sm">
                      Recovery codes can be used to access your account if you
                      lose your two-factor authentication device.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Login Sessions</CardTitle>
                  <CardDescription>
                    Manage your active login sessions.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 rounded-full p-2">
                          <Smartphone className="text-primary h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Current Session</p>
                          <p className="text-muted-foreground text-xs">
                            Chrome on Windows • IP: 192.168.1.1 • Active now
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" disabled>
                        Current
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 rounded-full p-2">
                          <Smartphone className="text-primary h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Mobile App</p>
                          <p className="text-muted-foreground text-xs">
                            iPhone • IP: 192.168.1.2 • Last active: 2 hours ago
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Revoke
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="text-destructive w-full">
                    Log Out of All Sessions
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function MyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="hsl(var(--primary))"
      className="size-4">
      <path d="M5.85 3.5a.75.75 0 0 0-1.117-1 9.719 9.719 0 0 0-2.348 4.876.75.75 0 0 0 1.479.248A8.219 8.219 0 0 1 5.85 3.5ZM19.267 2.5a.75.75 0 1 0-1.118 1 8.22 8.22 0 0 1 1.987 4.124.75.75 0 0 0 1.48-.248A9.72 9.72 0 0 0 19.266 2.5Z" />
      <path
        fillRule="evenodd"
        d="M12 2.25A6.75 6.75 0 0 0 5.25 9v.75a8.217 8.217 0 0 1-2.119 5.52.75.75 0 0 0 .298 1.206c1.544.57 3.16.99 4.831 1.243a3.75 3.75 0 1 0 7.48 0 24.583 24.583 0 0 0 4.83-1.244.75.75 0 0 0 .298-1.205 8.217 8.217 0 0 1-2.118-5.52V9A6.75 6.75 0 0 0 12 2.25ZM9.75 18c0-.034 0-.067.002-.1a25.05 25.05 0 0 0 4.496 0l.002.1a2.25 2.25 0 1 1-4.5 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
