export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

const waitForGoogleIdentity = () => {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error("Google sign-in is only available in the browser"),
    );
  }

  if (window.google?.accounts?.id) {
    return Promise.resolve(window.google.accounts.id);
  }

  return new Promise((resolve, reject) => {
    let attempts = 0;
    const maxAttempts = 100;

    const intervalId = setInterval(() => {
      attempts += 1;
      if (window.google?.accounts?.id) {
        clearInterval(intervalId);
        resolve(window.google.accounts.id);
      } else if (attempts >= maxAttempts) {
        clearInterval(intervalId);
        reject(new Error("Failed to load Google sign-in"));
      }
    }, 50);
  });
};

export const renderGoogleButton = async (container, options) => {
  const googleAccounts = await waitForGoogleIdentity();
  if (!container) throw new Error("Google button container is missing");

  googleAccounts.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: options.onCredential,
    auto_select: false,
  });

  container.innerHTML = "";

  googleAccounts.renderButton(container, {
    theme: "outline",
    size: "large",
    type: "standard",
    text: options.text,
    shape: "pill",
    width: Math.min(container.clientWidth || 320, 400),
  });
};

export const exchangeGoogleCredential = async (credential) => {
  const { data } = await API.post("/api/users/google-login", {
    credential: credential,
  });
  return data;
};

import API from "@/app/config/api";
