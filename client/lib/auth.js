import { cookies } from "next/headers";

export const getCurrentUser = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return { isAuthenticated: false, user: null };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL || "http://localhost:5001"}/api/users/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        next: { revalidate: 0 }, // Ensure we don't cache auth status too aggressively
      },
    );

    if (!response.ok) {
      return { isAuthenticated: false, user: null };
    }

    const data = await response.json();
    return { isAuthenticated: true, user: data.user };
  } catch (error) {
    console.error("Error fetching current user:", error);
    return { isAuthenticated: false, user: null };
  }
};
