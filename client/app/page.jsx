import HeaderNav from "@/components/header-nav";
import FeaturedMovies from "@/components/home/featured-movies";
import HeroBanner from "@/components/home/hero-banner";
import Footer from "@/components/footer";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { isAuthenticated, user } = await getCurrentUser();

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderNav isAuthenticated={isAuthenticated} user={user} />
      <main className="flex-1">
        <HeroBanner />
        <FeaturedMovies />
      </main>
      <Footer />
    </div>
  );
}
