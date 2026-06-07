import { searchUsers } from "@/services/user.service";

export default async function TotalUsers({ query = "" }) {
  const { data: usersData = [] } = await searchUsers(query);

  const refinedUsers = usersData.map((user) => ({
    status: user.status ?? "active", // keep real status
  }));

  const publishedCount = refinedUsers.filter(
    (u) => u.status === "active",
  ).length;

  return (
    <>
      <div className="text-2xl font-bold">{usersData.length}</div>
      <p className="text-muted-foreground text-xs">
        {publishedCount} active users
      </p>
    </>
  );
}
