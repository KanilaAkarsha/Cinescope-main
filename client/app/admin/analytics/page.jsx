"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { analyticsData } from "@/lib/data";
import { getAnalytics } from "@/services/admin.service";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(analyticsData);
  const [stats, setStats] = useState({
    totalViews: 0,
    viewsChange: 0,
    newUsers: 0,
    usersChange: 0,
    reviewCount: 0,
    reviewsChange: 0,
    averageRating: 0,
    ratingChange: 0,
  });

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const result = await getAnalytics();

        if (!result?.success || !result?.data) {
          return;
        }

        setAnalytics({
          viewsByMonth: result.data.viewsByMonth || analyticsData.viewsByMonth,
          genreDistribution:
            result.data.genreDistribution || analyticsData.genreDistribution,
          ratingDistribution:
            result.data.ratingDistribution || analyticsData.ratingDistribution,
          topMovies: result.data.topMovies || analyticsData.topMovies,
        });

        setStats({
          totalViews: result.data.totalViews || 0,
          viewsChange: result.data.viewsChange || 0,
          newUsers: result.data.newUsers || 0,
          usersChange: result.data.usersChange || 0,
          reviewCount: result.data.reviewCount || 0,
          reviewsChange: result.data.reviewsChange || 0,
          averageRating: result.data.averageRating || 0,
          ratingChange: result.data.ratingChange || 0,
        });
      } catch (error) {
        console.error("Failed to load analytics:", error);
      }
    };

    loadAnalytics();
  }, []);

  const formattedTotalViews = useMemo(() => {
    const views = Number(stats.totalViews || 0);
    return views >= 1000 ? `${(views / 1000).toFixed(1)}K` : `${views}`;
  }, [stats.totalViews]);

  const formattedAverageRating = useMemo(
    () => `${Number(stats.averageRating || 0).toFixed(1)}/10`,
    [stats.averageRating],
  );

  const formatPercent = (value) => {
    const numeric = Number(value || 0);
    const sign = numeric >= 0 ? "+" : "";
    return `${sign}${numeric.toFixed(1)}% from last month`;
  };

  const formatRatingChange = (value) => {
    const numeric = Number(value || 0);
    const sign = numeric >= 0 ? "+" : "";
    return `${sign}${numeric.toFixed(1)} from last month`;
  };

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
    "#8884d8",
    "#82ca9d",
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground">
          View insights and statistics about your movie platform
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="movies">Movies</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Views
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formattedTotalViews}</div>
                <p className="text-xs text-muted-foreground">
                  {formatPercent(stats.viewsChange)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.newUsers.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatPercent(stats.usersChange)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.reviewCount.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatPercent(stats.reviewsChange)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg. Rating
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formattedAverageRating}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatRatingChange(stats.ratingChange)}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Monthly Views</CardTitle>
                <CardDescription>
                  Total views per month for the current year
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-6">
                <div className="h-75 w-full">
                  <ChartContainer
                    config={{
                      views: {
                        label: "Views",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analytics.viewsByMonth}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="views"
                          stroke="var(--color-views)"
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Genre Distribution</CardTitle>
                <CardDescription>
                  Distribution of movies by genre
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-6">
                <div className="h-75 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.genreDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count">
                        {analytics.genreDistribution.map((entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Rating Distribution</CardTitle>
                <CardDescription>
                  Distribution of movies by rating
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-6">
                <div className="h-75 w-full">
                  <ChartContainer
                    config={{
                      count: {
                        label: "Movies",
                        color: "hsl(var(--chart-3))",
                      },
                    }}
                    className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.ratingDistribution}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="rating" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="count" fill="var(--color-count)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Top Movies</CardTitle>
                <CardDescription>
                  Most viewed movies on the platform
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-6">
                <div className="h-75 w-full">
                  <ChartContainer
                    config={{
                      views: {
                        label: "Views",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={analytics.topMovies}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 100,
                          bottom: 5,
                        }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="title" width={100} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="views" fill="var(--color-views)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="movies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Movie Analytics</CardTitle>
              <CardDescription>
                Detailed analytics about your movie catalog
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This section will contain more detailed analytics about movies.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Analytics</CardTitle>
              <CardDescription>
                Detailed analytics about your user base
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This section will contain more detailed analytics about users.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
