"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { login } from "@/app/app/features/authSlice";
import {
  exchangeGoogleCredential,
  renderGoogleButton,
} from "@/lib/google-auth";

const persistSession = (token) => {
  localStorage.setItem("token", token);
  document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
};

export default function GoogleAuthButton({ action = "login" }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const containerRef = useRef(null);
  const [error, setError] = useState("");
  const [isRendering, setIsRendering] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    const mountButton = async () => {
      try {
        await renderGoogleButton(containerRef.current, {
          text: action === "signup" ? "signup_with" : "signin_with",
          onCredential: async (response) => {
            setIsSubmitting(true);
            setError("");
            try {
              const data = await exchangeGoogleCredential(response.credential);
              const normalizedUser = data.user || data.User;
              dispatch(login({ token: data.token, user: normalizedUser }));
              persistSession(data.token);
              toast.success(data.message);
              router.push("/");
            } catch (err) {
              const msg = err?.response?.data?.message || err.message;
              setError(msg);
              toast.error(msg);
            } finally {
              setIsSubmitting(false);
            }
          },
        });
      } catch (err) {
        if (active) setError(err.message || "Google sign-in is unavailable");
      } finally {
        if (active) setIsRendering(false);
      }
    };

    mountButton();
    return () => {
      active = false;
    };
  }, [action, dispatch, router]);

  return (
    <div className="space-y-2">
      <div ref={containerRef} className="flex justify-center" />
      {isRendering && (
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" />
          Loading Google button...
        </div>
      )}
      {isSubmitting && (
        <div className="text-center text-xs text-muted-foreground">
          Signing in with Google...
        </div>
      )}
      {error && <p className="text-center text-xs text-red-600">{error}</p>}
    </div>
  );
}
