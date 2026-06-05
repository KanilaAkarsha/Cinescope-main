"use client";
import Link from "next/link";
import { UserIcon, SettingsIcon, LogOutIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout } from "@/app/app/features/authSlice";

export default function AdminNav() {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      dispatch(logout());
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    } finally {
      router.push("/login");
    }
  };

  const initials = (
    user?.name || `${user?.first_name} ${user?.last_name}`.trim()
  )
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-10 w-10 border-2 border-primary">
          <AvatarImage
            src={user?.image || user?.profilePicture}
            alt={`${user?.first_name} ${user?.last_name}`.trim()}
          />
          <AvatarFallback className="bg-primary text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {`${user?.first_name} ${user?.last_name}`.trim()}
            </p>
            <p className="text-muted-foreground text-xs leading-none">
              {user?.email || "Not provided"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/admin/profile">
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/admin/settings">
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
  );
}
