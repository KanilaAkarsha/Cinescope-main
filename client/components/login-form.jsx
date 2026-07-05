"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import API from "@/app/config/api";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { login } from "@/app/app/features/authSlice";
import GoogleAuthButton from "@/components/google-auth-button";

const DEFAULT_ERROR = {
  error: false,
  message: "",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [error, setError] = useState(DEFAULT_ERROR);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (email, password) => {
    if (email === "") {
      setError({ error: true, message: "Email is required" });
      return false;
    } else if (password === "") {
      setError({ error: true, message: "Password is required" });
      return false;
    } else if (!EMAIL_REGEX.test(email)) {
      setError({ error: true, message: "Invalid email format" });
      return false;
    }
    setError(DEFAULT_ERROR);
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    if (!validateForm(email, password)) {
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await API.post(`/api/users/login`, { email, password });
      const normalizedUser = data.user || data.User;
      dispatch(login({ token: data.token, user: normalizedUser }));
      localStorage.setItem("token", data.token);
      document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
      toast.success(data.message);
      router.push("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Outer wrapper: centers the card vertically and horizontally on all screen sizes,
    // adds horizontal padding on mobile so the card doesn't touch screen edges
    <div className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      {/* Card is full-width on mobile, capped at sm on larger screens */}
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Login to Your Account</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} noValidate>
              <div className="flex flex-col gap-5">
                {/* Email field */}
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    required
                    // Larger tap target on mobile via taller height
                    className="h-11 sm:h-10"
                  />
                </div>

                {/* Password field */}
                <div className="grid gap-2">
                  {/* Stack label + forgot link: row on sm+, column on xs */}
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="#"
                      className="text-sm text-muted-foreground underline-offset-4 hover:underline self-start sm:self-auto">
                      Forgot your password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    required
                    className="h-11 sm:h-10"
                  />
                </div>

                {/* Inline error message */}
                {error.error && (
                  <p className="text-center text-xs text-red-600 animate-pulse">
                    {error.message}
                  </p>
                )}

                {/* Action buttons */}
                <div className="flex flex-col gap-3">
                  <Button
                    type="submit"
                    className="w-full h-11 sm:h-10"
                    disabled={isLoading}>
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Login
                  </Button>
                  <GoogleAuthButton action="login" />
                </div>

                {/* Sign-up link */}
                <p className="text-center text-sm text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="../signup"
                    className="font-medium text-foreground underline underline-offset-4 hover:text-primary">
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
