import { searchUsers } from "@/services/user.service";
import UsersPageClient from "./users-page-client";

export const dynamic = "force-dynamic";

export default async function UsersData({ query = "" }) {
  try {
    const result = await searchUsers(query);
    console.log("1. searchUsers result:", result); // check success + data

    const { data: UserData = [], success } = result;
    console.log("2. UserData:", UserData); // check array contents
    console.log("3. UserData length:", UserData.length);

    if (!success) {
      console.log("4. Failed — success is false");
      return <div>Failed to load users.</div>;
    }

    if (!UserData.length) {
      console.log("5. Empty array returned");
      return <div>No Users Available!</div>;
    }

    const refinedUsers = UserData.map((user) => ({
      id: user._id.toString(),
      name: `${user.first_name} ${user.last_name}`.trim(), // ← fix
      email: user.email,
      role: user.role ?? "user",
      status: user.status ?? "active",
      createdAt: user.createdAt,
      image: user.image || user.profilePicture || "",
    }));

    console.log("6. refinedUsers:", refinedUsers);
    return <UsersPageClient initialUsers={refinedUsers} />;
  } catch (err) {
    console.error("7. Caught error:", err.message);
    return <div>No Users Available!</div>;
  }
}
