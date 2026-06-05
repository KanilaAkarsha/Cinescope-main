import users from "../models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "default_secret", {
    expiresIn: "7d",
  });
};
// Implement registerUser function

export const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password, confirm_password } =
      req.body;

    if (!first_name || !last_name || !email || !password || !confirm_password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await users.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (password !== confirm_password) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const newUser = await users.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(newUser._id);

    res
      .status(201)
      .json({ message: "User registered successfully", token, user: newUser });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(400).json({ message: error.message });
  }
};

// Implement loginUser function

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await users.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);
    user.password = undefined; // Hide password in response

    return res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(400).json({ message: "Server error" });
  }
};

//controller for getting user by id
export const getUserById = async (req, res) => {
  try {
    const userId = req.userId; // Assuming userId is set in the request object after authentication
    const user = await users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.password = undefined; // Hide password in response
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(400).json({ message: "Server error" });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await users.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching current user:", error);
    return res.status(400).json({ message: "Server error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.userId; // Default to current user
    const {
      id, // If admin wants to update someone else
      first_name,
      last_name,
      email,
      current_password,
      new_password,
      confirm_password,
      role,
      profilePicture,
      bio,
      language,
      timezone,
    } = req.body;

    const targetUserId = id || userId;
    const user = await users.findById(targetUserId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Only allow password change if it's the user themselves
    if (targetUserId === userId && current_password && new_password && confirm_password) {
      const isMatch = await user.comparePassword(current_password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid current password" });
      }
      if (new_password !== confirm_password) {
        return res.status(400).json({ message: "New passwords do not match" });
      }
      user.password = await bcrypt.hash(new_password, 8);
    }

    user.first_name = first_name || user.first_name;
    user.last_name = last_name || user.last_name;
    user.email = email || user.email;
    user.role = role || user.role;
    user.profilePicture = profilePicture || user.profilePicture;
    user.bio = bio !== undefined ? bio : user.bio;
    user.language = language || user.language;
    user.timezone = timezone || user.timezone;

    await user.save();

    user.password = undefined; // Hide password in response
    return res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(400).json({ message: "Server error" });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await users.countDocuments();
    const Movie = (await import("../models/movies.js")).default;
    const totalMovies = await Movie.countDocuments();

    const movies = await Movie.find();
    let totalReviews = 0;
    movies.forEach((m) => (totalReviews += m.reviews.length));

    return res.status(200).json({
      stats: {
        totalUsers,
        totalMovies,
        totalReviews,
      },
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return res.status(400).json({ message: error.message });
  }
};

export const getAllUsersForAdmin = async (req, res) => {
  try {
    const allUsers = await users.find().select("-password");
    return res.status(200).json({ users: allUsers });
  } catch (error) {
    console.error("Error fetching all users:", error);
    return res.status(400).json({ message: error.message });
  }
};

export const deleteUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    await users.findByIdAndDelete(id);
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(400).json({ message: error.message });
  }
};

export const getAdminAnalytics = async (req, res) => {
  try {
    const totalUsers = await users.countDocuments();
    const Movie = (await import("../models/movies.js")).default;
    const totalMovies = await Movie.countDocuments();

    // Get movies with reviews
    const movies = await Movie.find();
    let totalReviews = 0;
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 };
    const genreCounts = {};
    let sumRating = 0;
    let moviesWithRating = 0;

    movies.forEach((m) => {
      totalReviews += m.reviews.length;
      
      // Genre distribution
      const movieGenres = Array.isArray(m.genre) ? m.genre : (m.genre ? [m.genre] : []);
      movieGenres.forEach(g => {
        genreCounts[g] = (genreCounts[g] || 0) + 1;
      });

      // Rating distribution
      const rating = m.rating || (m.imdb && m.imdb.rating);
      if (rating) {
        const roundedRating = Math.round(rating);
        if (roundedRating >= 1 && roundedRating <= 10) {
          ratingCounts[roundedRating]++;
        }
        sumRating += Number(rating);
        moviesWithRating++;
      }
    });

    const averageRating = moviesWithRating > 0 ? sumRating / moviesWithRating : 0;

    // Top movies by reviews (as a proxy for views since we don't have views yet)
    const topMovies = movies
      .sort((a, b) => b.reviews.length - a.reviews.length)
      .slice(0, 5)
      .map(m => ({
        title: m.title,
        views: m.reviews.length * 10 + 50 // Mocking views based on reviews
      }));

    const analytics = {
      totalViews: totalReviews * 15, // Mocking views
      viewsChange: 12.5,
      newUsers: totalUsers,
      usersChange: 8.2,
      reviewCount: totalReviews,
      reviewsChange: 5.4,
      averageRating: averageRating,
      ratingChange: 0.2,
      viewsByMonth: [
        { month: "Jan", views: 400 },
        { month: "Feb", views: 300 },
        { month: "Mar", views: 200 },
        { month: "Apr", views: 278 },
        { month: "May", views: 189 },
        { month: "Jun", views: 239 },
      ],
      genreDistribution: Object.keys(genreCounts).map(name => ({
        name,
        count: genreCounts[name]
      })),
      ratingDistribution: Object.keys(ratingCounts).map(rating => ({
        rating,
        count: ratingCounts[rating]
      })),
      topMovies
    };

    return res.status(200).json({ success: true, analytics });
  } catch (error) {
    console.error("Error fetching admin analytics:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};
