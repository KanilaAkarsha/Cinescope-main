import { useSelector } from "react-redux";
import API from "@/app/config/api";
import { login } from "@/app/app/features/authSlice";
import { store } from "@/app/app/store";

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  "375577088049-o95gbu8g5dp4i1kppamsbinjs1qn49aa.apps.googleusercontent.com";

const loadGoogleIdentityScript = () => {
  const browserWindow = globalThis.window;

  if (browserWindow === undefined) {
    return Promise.reject(
      new Error("Google sign-in is only available in the browser"),
    );
  }

  if (browserWindow.google?.accounts?.id) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    let attempts = 0;
    const maxAttempts = 100;

    const intervalId = setInterval(() => {
      attempts += 1;

      if (browserWindow.google?.accounts?.id) {
        clearInterval(intervalId);
        resolve();
        return;
      }

      if (attempts >= maxAttempts) {
        clearInterval(intervalId);
        reject(new Error("Failed to load Google sign-in"));
      }
    }, 50);
  });
};

export const authClient = {
  signIn: {
    social: async ({ provider } = {}) => {
      if (provider !== "google") {
        throw new Error("Unsupported social provider");
      }

      await loadGoogleIdentityScript();

      return new Promise((resolve, reject) => {
        const google = globalThis.window?.google;

        if (!google?.accounts?.id) {
          reject(new Error("Google sign-in is unavailable"));
          return;
        }

        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (response) => {
            try {
              const { data } = await API.post("/api/users/google-login", {
                credential: response.credential,
              });

              store.dispatch(login({ token: data.token, user: data.user }));
              localStorage.setItem("token", data.token);
              document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;

              resolve({ success: true, data });
            } catch (error) {
              reject(error);
            }
          },
        });

        google.accounts.id.prompt();
      });
    },
  },
  signOut: async () => {
    return { success: true };
  },
  useSession: () => {
    const { user, loading } = useSelector((state) => state.auth);
    let status = "unauthenticated";

    if (loading) {
      status = "loading";
    } else if (user) {
      status = "authenticated";
    }

    return {
      data: user ? { user } : null,
      status,
    };
  },
};

export const { signIn, signOut, useSession } = authClient;
