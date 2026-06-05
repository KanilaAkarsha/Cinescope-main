import { getUsers } from "@/services/user.service";
import UsersPageClient from "./users-page-client";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const { data: users = [] } = await getUsers();
  console.log(users);

  return <UsersPageClient initialUsers={users} />;
}
