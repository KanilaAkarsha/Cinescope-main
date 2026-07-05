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
import { toast } from "react-hot-toast";
import API from "@/app/config/api";
import { useDispatch } from "react-redux";
import { login } from "@/app/app/features/authSlice";
import GoogleAuthButton from "@/components/google-auth-button";

export default function SignupForm() {
  const navigate = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);

    const payload = {
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirm_password: formData.get("confirm_password"),
    };

    try {
      const { data } = await API.post(`/api/users/register`, payload);
      console.log("API Response:", data);

      const normalizedUser = data.user || data.User;

      dispatch(login({ token: data.token, user: normalizedUser }));

      localStorage.setItem("token", data.token);
      document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
      toast.success(data.message);
      navigate.push("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <Card>
        <CardHeader>
          <CardTitle>Create Your Account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-6">
              <div className="flex flex-row gap-6 justify-between">
                <div className="grid gap-3">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    type="text"
                    autoComplete="given-name"
                    placeholder="First Name"
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    type="text"
                    autoComplete="family-name"
                    placeholder="Last Name"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  autoComplete="current_password"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Confirm Password</Label>
                </div>
                <Input
                  id="confirm_password"
                  type="password"
                  name="confirm_password"
                  autoComplete="current_password"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="animate-spin" />} Sign Up
                </Button>
                <GoogleAuthButton action="signup" />
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline underline-offset-4">
                Log in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
