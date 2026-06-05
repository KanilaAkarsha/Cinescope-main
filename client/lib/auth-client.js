import { useSelector } from "react-redux";

export const authClient = {
  signIn: {
    social: async () => ({ success: true }),
  },
  signOut: async () => {
    return { success: true };
  },
  useSession: () => {
    const { user, loading } = useSelector((state) => state.auth);
    return {
      data: user ? { user } : null,
      status: loading ? "loading" : user ? "authenticated" : "unauthenticated",
    };
  },
};

export const { signIn, signOut, useSession } = authClient;
