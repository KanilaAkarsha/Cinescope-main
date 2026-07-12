"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Bell, Check, Globe, Lock, Palette, Shield } from "lucide-react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import UserNav from "@/components/user-nav";
import { updateProfile } from "@/services/admin.service";
import { login } from "@/app/app/features/authSlice";

export default function SettingsPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState({
    siteName: "CineScope",
    siteDescription: "A comprehensive movie management platform.",
    language: "en",
    timezone: "utc",
    themeMode: "system",
    primaryColor: "blue",
    fontSize: "medium",
    animations: true,
    emailNewMovie: true,
    emailNewReview: true,
    emailNewUser: false,
    pushEnabled: true,
    pushNewMovie: true,
    pushNewReview: false,
  });

  useEffect(() => {
    if (user) {
      setSettings((prev) => ({
        ...prev,
        language: user.language || "en",
        timezone: user.timezone || "utc",
      }));
    }
  }, [user]);

  const handleSaveSettings = async () => {
    setIsSubmitting(true);

    try {
      const res = await updateProfile({
        id: user._id || user.id,
        language: settings.language,
        timezone: settings.timezone,
      });

      if (res.success) {
        dispatch(
          login({ user: res.data, token: localStorage.getItem("token") }),
        );
        toast.success("Settings saved successfully");
      } else {
        toast.error(res.message || "Failed to save settings");
      }
    } catch (error) {
      toast.error("An error occurred while saving settings");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (id, value) => {
    setSettings((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your application settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Advanced</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure general application settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="site-name">Site Name</Label>
                <Input
                  id="site-name"
                  value={settings.siteName}
                  onChange={(e) => handleInputChange("siteName", e.target.value)}
                />
                <p className="text-muted-foreground text-sm">
                  This is the name that will be displayed in the browser tab and
                  throughout the application.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="site-description">Site Description</Label>
                <Textarea
                  id="site-description"
                  value={settings.siteDescription}
                  onChange={(e) =>
                    handleInputChange("siteDescription", e.target.value)
                  }
                  className="min-h-[100px]"
                />
                <p className="text-muted-foreground text-sm">
                  This description will be used for SEO purposes.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Default Language</Label>
                <Select
                  value={settings.language}
                  onValueChange={(value) => handleInputChange("language", value)}>
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
                  value={settings.timezone}
                  onValueChange={(value) => handleInputChange("timezone", value)}>
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

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                  <p className="text-muted-foreground text-sm">
                    Put the site in maintenance mode.
                  </p>
                </div>
                <Switch
                  id="maintenance-mode"
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) =>
                    handleInputChange("maintenanceMode", checked)
                  }
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSaveSettings}
                disabled={isSubmitting}
                className="ml-auto">
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize the look and feel of your application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Theme Mode</Label>
                <RadioGroup
                  value={settings.themeMode}
                  onValueChange={(value) => handleInputChange("themeMode", value)}
                  className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="theme-light" />
                    <Label htmlFor="theme-light">Light</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="theme-dark" />
                    <Label htmlFor="theme-dark">Dark</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="theme-system" />
                    <Label htmlFor="theme-system">System</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Primary Color</Label>
                <div className="grid grid-cols-6 gap-2">
                  {["blue", "green", "red", "purple", "orange", "pink"].map(
                    (color) => (
                      <div
                        key={color}
                        onClick={() => handleInputChange("primaryColor", color)}
                        className={`h-10 cursor-pointer rounded-md border-2 ${
                          settings.primaryColor === color
                            ? "border-primary"
                            : "border-transparent"
                        }`}
                        style={{
                          backgroundColor:
                            color === "blue"
                              ? "hsl(221.2, 83.2%, 53.3%)"
                              : color === "green"
                                ? "hsl(142.1, 76.2%, 36.3%)"
                                : color === "red"
                                  ? "hsl(346.8, 77.2%, 49.8%)"
                                  : color === "purple"
                                    ? "hsl(262.1, 83.3%, 57.8%)"
                                    : color === "orange"
                                      ? "hsl(24.6, 95%, 53.1%)"
                                      : "hsl(316.6, 73.3%, 52.5%)",
                        }}>
                        {settings.primaryColor === color && (
                          <div className="flex h-full items-center justify-center">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="font-size">Font Size</Label>
                <Select
                  value={settings.fontSize}
                  onValueChange={(value) => handleInputChange("fontSize", value)}>
                  <SelectTrigger id="font-size">
                    <SelectValue placeholder="Select font size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="animations">Animations</Label>
                  <p className="text-muted-foreground text-sm">
                    Enable animations throughout the application.
                  </p>
                </div>
                <Switch
                  id="animations"
                  checked={settings.animations}
                  onCheckedChange={(checked) =>
                    handleInputChange("animations", checked)
                  }
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSaveSettings}
                disabled={isSubmitting}
                className="ml-auto">
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Notifications</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-new-movie">New Movie Added</Label>
                    <p className="text-muted-foreground text-sm">
                      Receive an email when a new movie is added.
                    </p>
                  </div>
                  <Switch
                    id="email-new-movie"
                    checked={settings.emailNewMovie}
                    onCheckedChange={(checked) =>
                      handleInputChange("emailNewMovie", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-new-review">New Review</Label>
                    <p className="text-muted-foreground text-sm">
                      Receive an email when a new review is submitted.
                    </p>
                  </div>
                  <Switch
                    id="email-new-review"
                    checked={settings.emailNewReview}
                    onCheckedChange={(checked) =>
                      handleInputChange("emailNewReview", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-new-user">
                      New User Registration
                    </Label>
                    <p className="text-muted-foreground text-sm">
                      Receive an email when a new user registers.
                    </p>
                  </div>
                  <Switch
                    id="email-new-user"
                    checked={settings.emailNewUser}
                    onCheckedChange={(checked) =>
                      handleInputChange("emailNewUser", checked)
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Push Notifications</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-enabled">
                      Enable Push Notifications
                    </Label>
                    <p className="text-muted-foreground text-sm">
                      Allow the application to send push notifications.
                    </p>
                  </div>
                  <Switch
                    id="push-enabled"
                    checked={settings.pushEnabled}
                    onCheckedChange={(checked) =>
                      handleInputChange("pushEnabled", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-new-movie">New Movie Added</Label>
                    <p className="text-muted-foreground text-sm">
                      Receive a push notification when a new movie is added.
                    </p>
                  </div>
                  <Switch
                    id="push-new-movie"
                    checked={settings.pushNewMovie}
                    onCheckedChange={(checked) =>
                      handleInputChange("pushNewMovie", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-new-review">New Review</Label>
                    <p className="text-muted-foreground text-sm">
                      Receive a push notification when a new review is
                      submitted.
                    </p>
                  </div>
                  <Switch
                    id="push-new-review"
                    checked={settings.pushNewReview}
                    onCheckedChange={(checked) =>
                      handleInputChange("pushNewReview", checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSaveSettings}
                disabled={isSubmitting}
                className="ml-auto">
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
