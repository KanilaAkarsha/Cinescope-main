import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Film,
  Users,
  MessageSquare,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getDashboardData } from "@/services/admin.service";
import RecentMovies from "./recent-movies";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const getUserRoleClass = (role) => {
  if (role === "admin") {
    return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
  }

  if (role === "moderator") {
    return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
  }

  return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
};

const getReviewStatusClass = (status) => {
  if (status === "approved") {
    return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
  }

  if (status === "pending") {
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
  }

  return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
};

const getActivityIcon = (type) => {
  if (type === "movie") {
    return <Film className="text-primary h-5 w-5" />;
  }

  if (type === "user") {
    return <Users className="text-primary h-5 w-5" />;
  }

  return <MessageSquare className="text-primary h-5 w-5" />;
};

export default async function AdminDashboard() {
  const token = cookies().get("token")?.value;
  const dashboardResult = await getDashboardData(token);
  const dashboard = dashboardResult?.success ? dashboardResult.data : {};
  const recentMovies = dashboard.recentMovies || [];
  const users = dashboard.users || [];
  const pendingReviews = dashboard.pendingReviews || 0;
  const approvedReviews = dashboard.approvedReviews || 0;
  const totalReviews = dashboard.totalReviews || 0;
  const recentActivity = dashboard.recentActivity || [];

  const timeAgo = (date) => {
    if (!date) return "Unknown";
    const parsedDate = date instanceof Date ? date : new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return "Unknown";
    const ms = Date.now() - parsedDate.getTime();
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    const d = Math.floor(h / 24);

    if (d > 0) return `${d} day${d > 1 ? "s" : ""} ago`;
    if (h > 0) return `${h} hour${h > 1 ? "s" : ""} ago`;
    if (m > 0) return `${m} minute${m > 1 ? "s" : ""} ago`;
    if (s === 1) return "1 second ago";
    return `${s} seconds ago`;
  };

  if (!dashboardResult?.success) {
    return (
      <div className=" text-foreground font-medium text-center py-12">
        {dashboardResult?.message || "No dashboard data available."}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome to the CineScope admin dashboard.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Movies</CardTitle>
            <Film className="text-primary h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard.totalMovies || 0}</div>
            <p className="text-muted-foreground text-xs">
              {dashboard.movies?.filter(m => m.status === "Published").length || 0} published
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="text-primary h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard.totalUsers || 0}</div>
            <p className="text-muted-foreground text-xs">
              Platform users in database
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Reviews
            </CardTitle>
            <MessageSquare className="text-primary h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReviews}</div>
            <p className="text-muted-foreground text-xs">
              {approvedReviews} approved reviews
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <MessageSquare className="text-primary h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReviews}</div>
            <p className="text-muted-foreground text-xs">
              Real review records from the database
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="border-primary/20 hover:bg-primary/5 flex items-center gap-4 rounded-md border p-4 transition-colors">
                <div className="bg-primary/10 rounded-full p-2">
                  <Film className="text-primary h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Add New Movie</h3>
                  <p className="text-muted-foreground text-sm">
                    Create a new movie entry
                  </p>
                </div>
                <Link href="/admin/movies">
                  <Button variant="outline" size="sm">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="border-primary/20 hover:bg-primary/5 flex items-center gap-4 rounded-md border p-4 transition-colors">
                <div className="bg-primary/10 rounded-full p-2">
                  <MessageSquare className="text-primary h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Moderate Reviews</h3>
                  <p className="text-muted-foreground text-sm">
                    {pendingReviews} reviews pending
                  </p>
                </div>
                <Link href="/admin/reviews">
                  <Button variant="outline" size="sm">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="border-primary/20 hover:bg-primary/5 flex items-center gap-4 rounded-md border p-4 transition-colors">
                <div className="bg-primary/10 rounded-full p-2">
                  <Users className="text-primary h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Manage Users</h3>
                  <p className="text-muted-foreground text-sm">
                    {users.length} users total
                  </p>
                </div>
                <Link href="/admin/users">
                  <Button variant="outline" size="sm">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="border-primary/20 hover:bg-primary/5 flex items-center gap-4 rounded-md border p-4 transition-colors">
                <div className="bg-primary/10 rounded-full p-2">
                  <TrendingUp className="text-primary h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">View Analytics</h3>
                  <p className="text-muted-foreground text-sm">
                    Platform performance metrics
                  </p>
                </div>
                <Link href="/admin/analytics">
                  <Button variant="outline" size="sm">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <div className="text-muted-foreground text-sm">
                  No recent activity
                </div>
              ) : (
                recentActivity.map((item, idx) => (
                  <div
                    key={`${item.type}-${idx}`}
                    className="flex items-center gap-4">
                    <div className="bg-primary/10 rounded-full p-2">
                      {getActivityIcon(item.type)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {item.description}
                        {item.title ? ` — ${item.title}` : ""}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {timeAgo(item.date)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recent-movies" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent-movies" className="text-xs sm:text-sm">
            Recent Movies
          </TabsTrigger>
          <TabsTrigger value="recent-users" className="text-xs sm:text-sm">
            Recent Users
          </TabsTrigger>
          <TabsTrigger value="recent-reviews" className="text-xs sm:text-sm">
            Recent Reviews
          </TabsTrigger>
        </TabsList>
        <TabsContent value="recent-movies" className="space-y-4">
          <RecentMovies movies={recentMovies} />
        </TabsContent>
        <TabsContent value="recent-users" className="space-y-4">
          <div className="rounded-md border">
            <div className="p-4">
              <h3 className="text-lg font-medium">Recent Users</h3>
              <p className="text-muted-foreground text-sm">
                Recently registered users on the platform.
              </p>
            </div>
            <div className="divide-y">
              {dashboard.recentUsers?.slice(0, 5).map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatar || user.profilePicture} alt={user.name} />
                      <AvatarFallback>
                        {user.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-muted-foreground text-xs">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${getUserRoleClass(user.role)}`}>
                      {user.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 text-right">
              <Link
                href="/admin/users"
                className="text-primary text-sm hover:underline">
                View All Users →
              </Link>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="recent-reviews" className="space-y-4">
          <div className="rounded-md border">
            <div className="p-4">
              <h3 className="text-lg font-medium">Recent Reviews</h3>
              <p className="text-muted-foreground text-sm">
                Latest reviews submitted by users.
              </p>
            </div>
            <div className="divide-y">
              {dashboard.recentReviews?.slice(0, 5).map((review) => {
                return (
                  <div key={review.id} className="p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={review.userAvatar || review.userProfilePicture}
                            alt={review.userName}
                          />
                          <AvatarFallback>
                            {review.userName?.charAt(0) || "A"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {review.userName}
                        </span>
                      </div>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${getReviewStatusClass(review.status)}`}>
                        {review.status}
                      </span>
                    </div>
                    <p className="mb-1 text-sm">
                      <span className="font-medium">Movie:</span>{" "}
                      {review.movieTitle}
                    </p>
                    <p className="mb-2 text-sm">
                      <span className="font-medium">Rating:</span>{" "}
                      {review.rating}/10
                    </p>
                    <p className="text-muted-foreground line-clamp-2 text-sm">
                      {review.comment}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="p-4 text-right">
              <Link
                href="/admin/reviews"
                className="text-primary text-sm hover:underline">
                View All Reviews →
              </Link>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
