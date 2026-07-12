"use client";

/* eslint-disable react/prop-types */

import { useState } from "react";
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
import {
  UserIcon,
  SettingsIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";
import { logout } from "@/app/app/features/authSlice";

export default function HeaderNav({ isAuthenticated, user }) {
  const router = useRouter();
  const role = user?.role?.toLowerCase();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout;
    } finally {
      router.push("/login");
      setMobileOpen(false);
    }
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="border-primary/20 bg-background sticky top-0 z-50 w-full border-b">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-1"
          onClick={closeMobile}>
          <Logo className="h-8 w-8" fill="fill-primary" />
          <div className="text-primary text-xl font-bold">CineScope.lk</div>
        </Link>

        {/* Desktop Nav */}
        <nav className="ml-auto hidden md:flex items-center gap-4">
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
                  className="flex items-center gap-2 hover:text-primary text-sm font-medium transition-colors cursor-pointer outline-hidden">
                  <div className="h-8 w-8 overflow-hidden rounded-full border border-primary/20">
                    {user?.profilePicture || user?.avatar || user?.image ? (
                      <img
                        src={user.profilePicture || user.avatar || user.image}
                        alt={user.name || "User"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="bg-primary flex h-full w-full items-center justify-center text-xs text-white">
                        {(user?.name || "U").charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span className="hidden lg:inline">{user?.name || "User"}</span>
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
          <ModeToggle />
        </nav>

        {/* Mobile: ModeToggle + Hamburger */}
        <div className="ml-auto flex items-center gap-2 md:hidden">
          <ModeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="hover:text-primary p-1 transition-colors"
            aria-label="Toggle menu">
            {mobileOpen ? (
              <XIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-primary/20 bg-background px-4 pb-4 pt-2 flex flex-col gap-1">
          <Link
            href="/movies"
            onClick={closeMobile}
            className="hover:text-primary hover:bg-primary/5 rounded-md px-3 py-2 text-sm font-medium transition-colors">
            Movies
          </Link>
          <Link
            href="/genres"
            onClick={closeMobile}
            className="hover:text-primary hover:bg-primary/5 rounded-md px-3 py-2 text-sm font-medium transition-colors">
            Genres
          </Link>
          <Link
            href="/about"
            onClick={closeMobile}
            className="hover:text-primary hover:bg-primary/5 rounded-md px-3 py-2 text-sm font-medium transition-colors">
            About
          </Link>

          {isAuthenticated && role === "admin" && (
            <Link
              href="/admin"
              onClick={closeMobile}
              className="hover:text-primary hover:bg-primary/5 rounded-md px-3 py-2 text-sm font-medium transition-colors">
              Dashboard
            </Link>
          )}

          {isAuthenticated && role === "user" && (
            <>
              <div className="border-t border-primary/10 my-1 pt-2 px-3 flex items-center gap-3">
                <div className="h-10 w-10 overflow-hidden rounded-full border border-primary/20">
                  {user?.profilePicture || user?.avatar || user?.image ? (
                    <img
                      src={user.profilePicture || user.avatar || user.image}
                      alt={user.name || "User"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="bg-primary flex h-full w-full items-center justify-center text-sm text-white">
                      {(user?.name || "U").charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{user?.name || "User"}</p>
                  <p className="text-muted-foreground text-xs">
                    {user?.email || "Not provided"}
                  </p>
                </div>
              </div>
              <Link
                href="/user/profile"
                onClick={closeMobile}
                className="hover:text-primary hover:bg-primary/5 rounded-md px-3 py-2 text-sm font-medium transition-colors flex items-center gap-2">
                <UserIcon className="h-4 w-4" />
                Profile
              </Link>
              <Link
                href="/user/settings"
                onClick={closeMobile}
                className="hover:text-primary hover:bg-primary/5 rounded-md px-3 py-2 text-sm font-medium transition-colors flex items-center gap-2">
                <SettingsIcon className="h-4 w-4" />
                Settings
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="hover:text-primary hover:bg-primary/5 rounded-md px-3 py-2 text-sm font-medium transition-colors flex items-center gap-2 w-full text-left">
                <LogOutIcon className="h-4 w-4" />
                Logout
              </button>
            </>
          )}

          {!isAuthenticated && (
            <Link
              href="/login"
              onClick={closeMobile}
              className="hover:text-primary hover:bg-primary/5 rounded-md px-3 py-2 text-sm font-medium transition-colors">
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
