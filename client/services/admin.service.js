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
export const getDashboardData = async () => {
  try {
    const [statsResponse, usersResponse, moviesResponse] = await Promise.all([
      API.get("/api/users/admin/stats"),
      API.get("/api/users/admin/users"),
      API.get("/api/movies/admin/movies"),
    ]);

    const stats = statsResponse.data.stats;
    const users = usersResponse.data.users;
    const movies = moviesResponse.data.movies;

    return {
      success: true,
      data: {
        totalUsers: stats.totalUsers,
        totalMovies: stats.totalMovies,
        totalReviews: stats.totalReviews,
        movies: movies || [],
        users: users || [],
        reviews: [], // Reviews endpoint might be separate
        pendingReviews: 0,
        approvedReviews: stats.totalReviews,
        totalViews: 0,
        viewsDelta: 0,
        recentActivity: [],
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

export const getAllUsers = async () => {
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
