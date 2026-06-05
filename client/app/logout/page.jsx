"use client";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { logout } from "@/app/app/features/authSlice";
import { useRouter } from "next/navigation";

export default function Logoutpage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const logoutUser = () => {
    dispatch(logout());
    router.push("/");
  };

  return (
    <div className="flex justify-center my-12">
      <Button onClick={logoutUser}>Logout</Button>
    </div>
  );
}
