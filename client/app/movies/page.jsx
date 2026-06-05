import HeaderNav from "@/components/header-nav";

import { getCurrentUser } from "@/lib/auth";

import MoviesPart from "./movies";

export const dynamic = "force-dynamic";

export default async function MoviesPage() {
  const { isAuthenticated, user } = await getCurrentUser();

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderNav isAuthenticated={isAuthenticated} user={user} />
      <main className="flex-1">
        <MoviesPart />
      </main>
    </div>
  );
}
