"use client";

/* eslint-disable react/prop-types */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "./logo";
import { ModeToggle } from "./mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserIcon, SettingsIcon, LogOutIcon } from "lucide-react";
import { logout } from "@/app/app/features/authSlice";

export default function HeaderNav({ isAuthenticated, user }) {
  const router = useRouter();
  const role = user?.role?.toLowerCase();

  const handleLogout = async () => {
    try {
      await logout;
    } finally {
      router.push("/login");
    }
  };

  return (
    <header className="border-primary/20 bg-background sticky top-0 z-50 w-full border-b">
      <div className="container flex h-16 items-center">
        {/*Website Logo*/}
        <Link href="/" className="flex items-center gap-1">
          <Logo className="h-8 w-8" fill="fill-primary" />
          <div className="text-primary text-xl font-bold">CineScope.lk</div>
        </Link>

        <nav className="ml-auto flex items-center gap-4">
          <Link
            href="/movies"
            className="hover:text-primary text-sm font-medium transition-colors">
            Movies
          </Link>
          <Link
            href="/genres"
            className="hover:text-primary text-sm font-medium transition-colors">
            Genres
          </Link>
          <Link
            href="/about"
            className="hover:text-primary text-sm font-medium transition-colors">
            About
          </Link>
          {isAuthenticated && role === "admin" && (
            <Link
              href="/admin"
              className="hover:text-primary text-sm font-medium transition-colors">
              Dashboard
            </Link>
          )}
          {isAuthenticated && role === "user" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="hover:text-primary text-sm font-medium transition-colors cursor-pointer">
                  User
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.name || "User"}
                    </p>
                    <p className="text-muted-foreground text-xs leading-none">
                      {user?.email || "Not provided"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/user/profile">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/user/settings">
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {!isAuthenticated && (
            <Link
              href="/login"
              className="hover:text-primary text-sm font-medium transition-colors">
              Login
            </Link>
          )}
          <ModeToggle /> {/* Mode Toggle Button */}
        </nav>
      </div>
    </header>
  );
}
