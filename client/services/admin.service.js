import API from "@/app/config/api";

export const getAnalytics = async () => {
  try {
    const { data } = await API.get("/api/users/admin/analytics");
    return { success: true, data: data.analytics };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};
export const getUsers = async () => {
  try {
    const { data } = await API.get("/api/users/admin/users");
    return { success: true, data: data.users };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};
export const updateRole = async (id, role) => {
  try {
    const { data } = await API.put("/api/users/update", { id, role });
    return { success: true, data: data.user };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

// services/admin.service.js
export const updateProfile = async (profileData) => {
  try {
    console.log("profilePicture length:", profileData.profilePicture?.length);
    console.log(
      "profilePicture preview:",
      profileData.profilePicture?.substring(0, 50),
    );
    const { data } = await API.put("/api/users/update", profileData);
    return { success: true, data: data.user };
  } catch (error) {
    console.error("updateProfile error:", error.response?.data);
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};
export const getDashboardData = async (token) => {
  try {
    const authConfig = token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : undefined;

    const [usersResponse, moviesResponse, reviewsResponse] = await Promise.all([
      API.get("/api/users/admin/users", authConfig),
      API.get("/api/movies/admin/movies", authConfig),
      API.get("/api/movies/reviews/all", authConfig),
    ]);

    const users = usersResponse.data.users || [];
    const movies = moviesResponse.data.movies || [];
    const reviews = reviewsResponse.data.reviews || [];

    const normalizeDate = (value) => {
      const parsedDate = value ? new Date(value) : null;
      return parsedDate && !Number.isNaN(parsedDate.getTime())
        ? parsedDate.toISOString()
        : null;
    };

    const normalizedUsers = users.map((user) => ({
      id: user._id?.toString() || user.id,
      name:
        `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
        user.email ||
        "Unknown User",
      email: user.email || "",
      role: user.role || "user",
      avatar: user.profilePicture || user.avatar || "",
      createdAt: normalizeDate(user.createdAt),
    }));

    const normalizedMovies = movies.map((movie) => ({
      id: movie._id?.toString() || movie.id,
      title: movie.title,
      year: movie.releaseYear || movie.year,
      genres: movie.genre || movie.genres || [],
      poster: movie.poster,
      rating: movie.rating || movie.imdb?.rating || 0,
      status: movie.status || "published",
      createdAt: normalizeDate(movie.createdAt),
    }));

    const normalizedReviews = reviews.map((review) => ({
      id: review._id?.toString() || review.id,
      movieId: review.movieId?.toString() || review.movieId,
      movieTitle: review.movieTitle || "Unknown Movie",
      rating: review.rating,
      comment: review.comment,
      status: review.status || "approved",
      userName:
        `${review.userId?.first_name || ""} ${review.userId?.last_name || ""}`.trim() ||
        review.userId?.email ||
        "Anonymous",
      userAvatar: review.userId?.profilePicture || review.userId?.avatar || "",
      createdAt: normalizeDate(review.createdAt),
    }));

    const pendingReviews = normalizedReviews.filter(
      (review) => review.status === "pending",
    ).length;
    const approvedReviews = normalizedReviews.filter(
      (review) => review.status === "approved",
    ).length;

    const recentMovies = [...normalizedMovies]
      .sort(
        (left, right) => new Date(right.createdAt) - new Date(left.createdAt),
      )
      .slice(0, 5);

    const recentUsers = [...normalizedUsers]
      .sort(
        (left, right) => new Date(right.createdAt) - new Date(left.createdAt),
      )
      .slice(0, 5);

    const recentReviews = [...normalizedReviews]
      .sort(
        (left, right) => new Date(right.createdAt) - new Date(left.createdAt),
      )
      .slice(0, 5);

    const recentActivity = [
      ...recentMovies.map((movie) => ({
        type: "movie",
        description: "New movie added",
        title: movie.title,
        date: movie.createdAt,
      })),
      ...recentUsers.map((user) => ({
        type: "user",
        description: "New user registered",
        title: user.name,
        date: user.createdAt,
      })),
      ...recentReviews.map((review) => ({
        type: "review",
        description: "New review submitted",
        title: review.movieTitle,
        date: review.createdAt,
      })),
    ]
      .filter((item) => item.date)
      .sort((left, right) => new Date(right.date) - new Date(left.date))
      .slice(0, 10);

    return {
      success: true,
      data: {
        totalUsers: normalizedUsers.length,
        totalMovies: normalizedMovies.length,
        totalReviews: normalizedReviews.length,
        pendingReviews,
        approvedReviews,
        movies: normalizedMovies,
        users: normalizedUsers,
        reviews: normalizedReviews,
        recentMovies,
        recentUsers,
        recentReviews,
        recentActivity,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const getDashboardStats = async () => {
  try {
    const { data } = await API.get("/api/users/admin/stats");
    return { success: true, data: data.stats };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const getAllUsers = async (query = "") => {
  try {
    const endpoint = query
      ? `/api/users/search?query=${encodeURIComponent(query)}`
      : "/api/users/admin/users";
    const { data } = await API.get(endpoint);
    return { success: true, data: data.users };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const deleteUser = async (id) => {
  try {
    await API.delete(`/api/users/admin/users/${id}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};
